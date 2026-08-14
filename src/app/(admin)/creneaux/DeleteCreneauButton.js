"use client";

import { deleteCreneauAction } from "./actions";

export default function DeleteCreneauButton({ id }) {
  return (
    <button
      onClick={() => {
        if (confirm("Supprimer ce créneau ? Les courses seront désassignées du voiturier.")) {
          deleteCreneauAction(id);
        }
      }}
      className="text-sm text-red-500 hover:underline"
    >
      Supprimer
    </button>
  );
}
