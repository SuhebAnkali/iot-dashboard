import Buildings from "./Buildings";
import Roads from "./Roads";

interface CityProps {
  mode: "CITY" | "WATER" | "LIGHTING" | "AI" | "ENERGY" | "NIGHT";
}

export default function City({ mode }: CityProps) {
  return (
    <group name="CityLayer">
      <Roads />
      <Buildings mode={mode} />
    </group>
  );
}