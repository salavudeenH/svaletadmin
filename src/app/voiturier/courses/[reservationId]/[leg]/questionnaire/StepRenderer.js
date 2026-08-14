"use client";

import SignaturePad from "./SignaturePad";
import PhotosField from "./PhotosField";

export default function StepRenderer({
  step,
  answers,
  setAnswer,
  parkings,
  reservationId,
  leg,
  uploadingPhotos,
  setUploadingPhotos,
  selectYesNo,
}) {
  return (
    <>
      {step.type === "yesno" && (
        <>
          <h1 className="text-white text-xl font-bold mb-6">{step.question}</h1>
          <div className="flex border border-white rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => selectYesNo(false)}
              className="flex-1 py-4 text-white font-bold border-r border-white hover:bg-white/10"
            >
              Non
            </button>
            <button
              type="button"
              onClick={() => selectYesNo(true)}
              className="flex-1 py-4 text-white font-bold hover:bg-white/10"
            >
              Oui
            </button>
          </div>
        </>
      )}

      {step.type === "date" && (
        <>
          <h1 className="text-white text-xl font-bold mb-6">{step.question}</h1>
          <input
            type="date"
            value={answers[step.key] || ""}
            onChange={(e) => setAnswer(step.key, e.target.value)}
            className="w-full text-center text-2xl bg-white/10 text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </>
      )}

      {step.type === "time" && (
        <>
          <h1 className="text-white text-xl font-bold mb-6">{step.question}</h1>
          <input
            type="time"
            value={answers[step.key] || ""}
            onChange={(e) => setAnswer(step.key, e.target.value)}
            className="w-full text-center text-3xl bg-white/10 text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </>
      )}

      {step.type === "text" && (
        <>
          <h1 className="text-white text-xl font-bold mb-6">{step.question}</h1>
          <div className="relative">
            <label className="absolute left-4 top-2 text-xs text-white/60">{step.label}</label>
            <input
              type="text"
              value={answers[step.key] || ""}
              onChange={(e) => setAnswer(step.key, e.target.value)}
              className="w-full bg-transparent border border-white rounded-xl px-4 pt-6 pb-2 text-white text-lg font-bold focus:outline-none"
            />
            {answers[step.key] && (
              <button
                type="button"
                onClick={() => setAnswer(step.key, "")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
              >
                ✕
              </button>
            )}
          </div>
        </>
      )}

      {step.type === "text2" && (
        <>
          <h1 className="text-white text-xl font-bold mb-6">{step.question}</h1>
          <div className="space-y-4">
            {step.keys.map((key, i) => (
              <div key={key} className="relative">
                <label className="absolute left-4 top-2 text-xs text-white/60">{step.labels[i]}</label>
                <input
                  type="text"
                  value={answers[key] || ""}
                  onChange={(e) => setAnswer(key, e.target.value)}
                  className="w-full bg-transparent border border-white rounded-xl px-4 pt-6 pb-2 text-white text-lg font-bold focus:outline-none"
                />
                {answers[key] && (
                  <button
                    type="button"
                    onClick={() => setAnswer(key, "")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {step.type === "number" && (
        <>
          <h1 className="text-white text-xl font-bold mb-2">{step.question}</h1>
          {step.hint && <p className="text-white/60 text-sm mb-4">{step.hint}</p>}
          <div className="relative">
            <label className="absolute left-4 top-2 text-xs text-white/60">{step.label}</label>
            <input
              type="number"
              inputMode="numeric"
              value={answers[step.key] || ""}
              onChange={(e) => setAnswer(step.key, e.target.value)}
              className="w-full bg-transparent border border-white rounded-xl px-4 pt-6 pb-2 text-white text-lg font-bold focus:outline-none"
            />
          </div>
        </>
      )}

      {step.type === "textarea" && (
        <>
          <h1 className="text-white text-xl font-bold mb-6">{step.question}</h1>
          <textarea
            rows={5}
            value={answers[step.key] || ""}
            onChange={(e) => setAnswer(step.key, e.target.value)}
            className="w-full bg-transparent border border-white rounded-xl px-4 py-3 text-white text-base focus:outline-none"
          />
        </>
      )}

      {step.type === "parking" && (
        <>
          <h1 className="text-white text-xl font-bold mb-6">{step.question}</h1>
          <div className="space-y-4">
            <div className="relative">
              <label className="absolute left-4 top-2 text-xs text-white/60">Parking</label>
              <select
                value={answers[step.keys[0]] || ""}
                onChange={(e) => setAnswer(step.keys[0], e.target.value)}
                className="w-full appearance-none bg-transparent border border-white rounded-xl px-4 pt-6 pb-2 text-white text-lg font-bold focus:outline-none [&>option]:text-ink"
              >
                <option value="" disabled>
                  Choisir un parking
                </option>
                {parkings.map((p) => (
                  <option key={p._id} value={p.nom}>
                    {p.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="absolute left-4 top-2 text-xs text-white/60">Numéro de clé</label>
              <input
                type="text"
                value={answers[step.keys[1]] || ""}
                onChange={(e) => setAnswer(step.keys[1], e.target.value)}
                className="w-full bg-transparent border border-white rounded-xl px-4 pt-6 pb-2 text-white text-lg font-bold focus:outline-none"
              />
            </div>
          </div>
        </>
      )}

      {step.type === "photos" && (
        <>
          <h1 className="text-white text-xl font-bold mb-6">{step.question}</h1>
          <PhotosField
            reservationId={reservationId}
            leg={leg}
            photoType={step.photoType}
            value={answers[step.key] || []}
            onChange={(next) => setAnswer(step.key, next)}
            uploading={uploadingPhotos}
            setUploading={setUploadingPhotos}
          />
        </>
      )}

      {step.type === "signature" && (
        <>
          <p className="text-white font-medium mb-4 leading-snug">{step.consent}</p>
          <div className="bg-white rounded-xl p-2">
            <SignaturePad onChange={(dataUrl) => setAnswer(step.key, dataUrl)} />
          </div>
        </>
      )}
    </>
  );
}
