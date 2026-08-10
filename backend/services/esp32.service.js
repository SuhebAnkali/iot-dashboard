/**
 * ESP32 REST API Client
 *
 * ESP32 endpoints:
 *
 * GET /status
 * GET /valve?w=1&state=1
 * GET /valve?w=1&state=0
 * GET /light?state=on
 * GET /light?state=off
 * GET /light?state=auto
 * GET /refill
 */


// =====================================================
// CONFIGURATION
// =====================================================

const ESP32_BASE = () =>
  `http://${process.env.ESP32_IP || '192.168.1.50'}`;

const TIMEOUT_MS =
  Number(process.env.ESP32_TIMEOUT_MS || 3000);


// =====================================================
// FETCH WITH TIMEOUT
// =====================================================

async function fetchWithTimeout(url) {

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);

  try {

    console.log(`[ESP32] Request -> ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });


    if (!response.ok) {

      const body = await response.text();

      throw new Error(
        `ESP32 HTTP ${response.status}: ${body}`
      );
    }


    const text = await response.text();


    if (!text) {

      return {
        success: true,
      };
    }


    try {

      const data = JSON.parse(text);

      console.log(
        '[ESP32] Response:',
        data
      );

      return data;

    } catch {

      console.log(
        '[ESP32] Non-JSON response:',
        text
      );

      return {
        success: true,
        response: text,
      };
    }

  } catch (error) {

    if (error.name === 'AbortError') {

      console.error(
        `[ESP32] Request timeout after ${TIMEOUT_MS}ms`
      );

      throw new Error(
        'ESP32 request timed out'
      );
    }


    console.error(
      '[ESP32] Request failed:',
      error.message
    );


    throw error;

  } finally {

    clearTimeout(timer);
  }
}


// =====================================================
// NORMALIZE STATUS
// =====================================================

function normalizeStatus(raw = {}) {

  return {

    // -----------------------------------------
    // TANK
    // Supports:
    // tank
    // tankLevel
    // tankLevelMl
    // -----------------------------------------

    tankLevelMl: Number(
      raw.tank ??
      raw.tankLevel ??
      raw.tankLevelMl ??
      0
    ),


    // -----------------------------------------
    // FLOW RATE
    // Supports:
    // flow
    // flowRate
    // flowRateLpm
    // -----------------------------------------

    flowRateLpm: Number(
      raw.flow ??
      raw.flowRate ??
      raw.flowRateLpm ??
      0
    ),


    // -----------------------------------------
    // WARD CONSUMPTION
    // -----------------------------------------

    ward1Ml: Number(
      raw.w1 ??
      raw.ward1 ??
      raw.ward1Ml ??
      0
    ),

    ward2Ml: Number(
      raw.w2 ??
      raw.ward2 ??
      raw.ward2Ml ??
      0
    ),

    ward3Ml: Number(
      raw.w3 ??
      raw.ward3 ??
      raw.ward3Ml ??
      0
    ),


    // -----------------------------------------
    // ACTIVE WARD
    // -----------------------------------------

    activeWard: Number(
      raw.ward ??
      raw.activeWard ??
      0
    ),


    // -----------------------------------------
    // STREET LIGHT
    // -----------------------------------------

    streetLight: Boolean(
      raw.light ??
      raw.streetLight ??
      false
    ),


    // -----------------------------------------
    // LIGHT MODE
    // -----------------------------------------

    lightMode:
      raw.lightMode ??
      'auto',


    // -----------------------------------------
    // ALERTS
    // -----------------------------------------

    leakDetected: Boolean(
      raw.leak ??
      raw.leakDetected ??
      false
    ),

    dryTank: Boolean(
      raw.dry ??
      raw.dryTank ??
      false
    ),


    // -----------------------------------------
    // RTC
    // -----------------------------------------

    rtc:
      raw.rtc ??
      null,


    // -----------------------------------------
    // STATUS TIMESTAMP
    // -----------------------------------------

    timestamp:
      new Date().toISOString(),
  };
}


// =====================================================
// GET ESP32 STATUS
// =====================================================

async function getStatus() {

  try {

    const raw =
      await fetchWithTimeout(
        `${ESP32_BASE()}/status`
      );


    return normalizeStatus(raw);

  } catch (error) {

    console.error(
      '[ESP32] Status failed:',
      error.message
    );

    throw error;
  }
}


// =====================================================
// CONTROL VALVE
//
// wardNumber:
// 1 / 2 / 3
//
// state:
// true  = OPEN
// false = CLOSE
//
// Exact firmware format:
//
// /valve?w=1&state=1
// /valve?w=1&state=0
// =====================================================

async function setValve(
  wardNumber,
  state
) {

  const ward =
    Number(wardNumber);


  // -----------------------------------------
  // Validate ward
  // -----------------------------------------

  if (![1, 2, 3].includes(ward)) {

    throw new Error(
      `Invalid ward number: ${wardNumber}`
    );
  }


  // -----------------------------------------
  // Normalize state
  // -----------------------------------------

  let open;


  if (
    state === true ||
    state === 1 ||
    state === '1' ||
    state === 'open' ||
    state === 'on' ||
    state === 'true'
  ) {

    open = true;

  } else {

    open = false;
  }


  const stateValue =
    open ? 1 : 0;


  const url =
    `${ESP32_BASE()}/valve?w=${ward}&state=${stateValue}`;


  console.log(
    `[ESP32] Valve ${ward} -> ${open ? 'OPEN' : 'CLOSE'}`
  );


  try {

    const result =
      await fetchWithTimeout(url);


    console.log(
      `[ESP32] Ward ${ward} ${
        open ? 'opened' : 'closed'
      } successfully`
    );


    return {
      success: true,
      ward,
      state: open,
      ...result,
    };

  } catch (error) {

    console.error(
      `[ESP32] Ward ${ward} control failed:`,
      error.message
    );


    throw error;
  }
}


// =====================================================
// STREET LIGHT CONTROL
//
// mode:
// on
// off
// auto
//
// Firmware expects:
// /light?state=on
// /light?state=off
// /light?state=auto
// =====================================================

async function setLight(mode) {

  let normalizedMode =
    String(mode || 'auto')
      .toLowerCase();


  if (
    ![
      'on',
      'off',
      'auto'
    ].includes(normalizedMode)
  ) {

    normalizedMode =
      'auto';
  }


  const url =
    `${ESP32_BASE()}/light?state=${normalizedMode}`;


  console.log(
    `[ESP32] Street light mode -> ${normalizedMode}`
  );


  try {

    const result =
      await fetchWithTimeout(url);


    return {
      success: true,
      mode: normalizedMode,
      ...result,
    };

  } catch (error) {

    console.error(
      '[ESP32] Light control failed:',
      error.message
    );


    throw error;
  }
}


// =====================================================
// REFILL TANK
// =====================================================

async function refillTank() {

  const url =
    `${ESP32_BASE()}/refill`;


  console.log(
    '[ESP32] Refill command'
  );


  try {

    const result =
      await fetchWithTimeout(url);


    return {
      success: true,
      ...result,
    };

  } catch (error) {

    console.error(
      '[ESP32] Refill failed:',
      error.message
    );


    throw error;
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  getStatus,

  setValve,

  setLight,

  refillTank,

  normalizeStatus,
};