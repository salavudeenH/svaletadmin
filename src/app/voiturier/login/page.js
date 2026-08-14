"use client";

import Link from "next/link";
import { useActionState } from "react";
import { valetLoginAction } from "../actions";

const initialState = { error: null };

export default function VoiturierLoginPage() {
  const [state, formAction, pending] = useActionState(valetLoginAction, initialState);

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <form action={formAction} className="w-full max-w-xs text-center space-y-6">
        <div>
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand text-white text-xl font-bold mb-4">
            S
          </span>
          <h1 className="text-white text-2xl font-bold">SVALET</h1>
          <p className="text-white/50 text-sm mt-1">Espace voiturier</p>
        </div>

        <div>
          <input
            name="pin"
            type="tel"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            autoFocus
            placeholder="••••"
            className="w-full text-center text-3xl tracking-[0.5em] bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <p className="text-white/40 text-xs mt-2">Entrez votre code PIN à 4 chiffres</p>
        </div>

        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl px-4 py-3.5 transition-colors disabled:opacity-60"
        >
          {pending ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-sm text-white/50">
          Vous êtes admin ?{" "}
          <Link href="/login" className="text-white font-medium underline decoration-dotted">
            Accéder à l'espace admin
          </Link>
        </p>
      </form>
    </div>
  );
}
