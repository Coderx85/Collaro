import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function PriceTable() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 gap-20">
      <PricingTable
        appearance={{
          baseTheme: dark,
        }}
      />
    </div>
  );
}
