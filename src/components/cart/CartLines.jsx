import { Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getProduct, unitPrice } from "../../data/products";
import { money } from "../../utils/format";
import Qty from "../ui/Qty";

export default function CartLines() {
  const { items, lang, t, setQty, remove } = useApp();
  return (
    <ul className="divide-y divide-gold/40">
      {items.map((it) => {
        const p = getProduct(it.productId);
        if (!p) return null;
        const size = p.sizes?.find((s) => s.id === it.sizeId);
        return (
          <li key={it.key} className="py-4 flex gap-3">
            <img
              src={p.image}
              alt=""
              width="80"
              height="80"
              loading="lazy"
              className="w-20 h-20 rounded-xl object-cover border-2 border-gold shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-burgundy leading-tight">
                {p.name[lang]}
              </h3>
              {size && (
                <p className="text-sm font-semibold">
                  {t("common.size")}: {size.label[lang]}
                </p>
              )}
              <p className="text-md font-bold text-burgundy">
                {money(unitPrice(p, it.sizeId), lang)}
              </p>{" "}
              <div className="flex items-center justify-between mt-2 gap-2">
                <Qty value={it.qty} onChange={(q) => setQty(it.key, q)} />
                <div className="flex items-center gap-1">
                  <strong className="text-burgundy">
                    {money(unitPrice(p, it.sizeId) * it.qty, lang)}
                  </strong>
                  <button
                    onClick={() => remove(it.key)}
                    aria-label={`${t("common.remove")}: ${p.name[lang]}`}
                    className="p-2 text-red-800 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
