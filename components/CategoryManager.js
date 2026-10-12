import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { moveProduct } from "../lib/catalog-editor.mjs";

export function CategoryManager({
  categories,
  products,
  busy,
  onChange,
  buttonClass,
  inputClass,
}) {
  return (
    <section
      aria-label="Gerenciar categorias"
      className="rounded-2xl border border-green-900/10 bg-white p-5 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-green-950">
            Categorias de produtos
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Renomeie e organize os filtros do catálogo. Os produtos continuam
            vinculados ao renomear.
          </p>
        </div>
        <button
          type="button"
          disabled={busy || categories.length >= 30}
          className={buttonClass}
          onClick={() =>
            onChange([...categories, { _key: crypto.randomUUID(), name: "" }])
          }
        >
          <Plus size={17} /> Nova categoria
        </button>
      </div>
      <ul className="mt-6 space-y-3">
        {categories.map((category, index) => {
          const count = products.filter(
            (product) => product.categoryId === category._key,
          ).length;
          const cannotRemove = busy || count > 0 || categories.length === 1;
          return (
            <li
              key={category._key}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-4"
            >
              <label className="min-w-[180px] flex-1 text-sm font-medium">
                Nome da categoria {index + 1}
                <input
                  className={inputClass}
                  value={category.name}
                  maxLength={60}
                  disabled={busy}
                  placeholder="Ex.: Flores Comestíveis"
                  onChange={(event) =>
                    onChange(
                      categories.map((item) =>
                        item._key === category._key
                          ? { ...item, name: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
                <span className="mt-2 block text-xs text-gray-500">
                  {count} {count === 1 ? "produto" : "produtos"}
                  {count > 0
                    ? " · Para remover, mova os produtos para outra categoria."
                    : ""}
                </span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={busy || index === 0}
                  className={buttonClass}
                  aria-label={`Mover categoria ${category.name || index + 1} para cima`}
                  onClick={() =>
                    onChange(moveProduct(categories, index, index - 1))
                  }
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  type="button"
                  disabled={busy || index === categories.length - 1}
                  className={buttonClass}
                  aria-label={`Mover categoria ${category.name || index + 1} para baixo`}
                  onClick={() =>
                    onChange(moveProduct(categories, index, index + 1))
                  }
                >
                  <ArrowDown size={17} />
                </button>
                <button
                  type="button"
                  disabled={cannotRemove}
                  className={buttonClass}
                  aria-label={`Remover categoria ${category.name || index + 1}`}
                  title={
                    count
                      ? "Mova os produtos para outra categoria antes de remover."
                      : categories.length === 1
                        ? "Mantenha pelo menos uma categoria."
                        : "Remover categoria"
                  }
                  onClick={() =>
                    onChange(
                      categories.filter((item) => item._key !== category._key),
                    )
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
