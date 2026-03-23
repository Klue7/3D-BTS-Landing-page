import React, { useEffect, useId, useMemo, useState } from 'react';
import { ArrowLeft, ImagePlus, Upload } from 'lucide-react';
import { useProductCatalog } from './ProductCatalogContext';

interface UploadPreviewPageProps {
  navigate: (path: string) => void;
}

export function UploadPreviewPage({ navigate }: UploadPreviewPageProps) {
  const { activeProduct } = useProductCatalog();
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const helperCopy = useMemo(() => {
    return `Upload a straight-on room photo to start a ${activeProduct.productName} finish preview.`;
  }, [activeProduct.productName]);

  return (
    <main className="relative z-10 min-h-screen px-5 pb-12 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto flex w-full max-w-[76rem] flex-col gap-7">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={() => navigate('/#related-products')}
            className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/72 transition-colors hover:border-[#22c55e]/48 hover:text-[#22c55e]"
          >
            <ArrowLeft size={15} />
            Back To Product
          </button>

          <div className="flex items-center gap-3 rounded-full border border-[#22c55e]/25 bg-[#080808]/78 px-4 py-3 text-[0.7rem] uppercase tracking-[0.26em] text-white/68 backdrop-blur-sm">
            <img
              src={activeProduct.finishAssets.faceImage}
              alt={`${activeProduct.productName} face detail`}
              className="h-10 w-16 rounded-[0.65rem] border border-white/10 object-cover"
            />
            <div className="leading-tight">
              <span className="block text-white/42">Selected finish</span>
              <span className="mt-1 block text-[#22c55e]">{activeProduct.productName}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-[2rem] border border-white/10 bg-[#070707]/92 p-7 shadow-[0_28px_70px_rgba(0,0,0,0.34)] md:p-9">
            <span className="inline-flex rounded-full border border-[#22c55e]/38 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#22c55e]">
              Upload Preview
            </span>

            <h1 className="mt-5 font-['Anton'] text-[clamp(2.8rem,5vw,4.75rem)] uppercase leading-[0.88] tracking-[-0.06em] text-white">
              Your Wall.
            </h1>

            <p className="mt-4 max-w-[28rem] text-[0.98rem] leading-7 text-white/58">
              {helperCopy}
            </p>

            <label
              htmlFor={inputId}
              className="mt-8 flex min-h-[15rem] cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.012))] px-8 text-center transition-colors hover:border-[#22c55e]/44 hover:bg-[#22c55e]/[0.04]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#22c55e]">
                <Upload size={22} />
              </span>
              <span className="mt-5 text-[0.82rem] font-semibold uppercase tracking-[0.28em] text-white">
                {selectedFile ? 'Replace Room Photo' : 'Choose Room Photo'}
              </span>
              <span className="mt-3 max-w-[18rem] text-sm leading-6 text-white/48">
                JPG or PNG works best. Keep the wall straight and fully visible for the cleanest finish test.
              </span>
              {selectedFile ? (
                <span className="mt-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/72">
                  {selectedFile.name}
                </span>
              ) : null}
            </label>

            <input
              id={inputId}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setSelectedFile(nextFile);
              }}
            />
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[#060606]/92 p-5 shadow-[0_28px_70px_rgba(0,0,0,0.32)] md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/42">Preview canvas</p>
                <p className="mt-2 text-sm leading-6 text-white/56">
                  {previewUrl
                    ? `Working preview base for ${activeProduct.productName}.`
                    : 'Your uploaded room will appear here once you choose a photo.'}
                </p>
              </div>
              <span className="rounded-full border border-[#22c55e]/24 bg-[#22c55e]/[0.06] px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-[#22c55e]">
                {activeProduct.productName}
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.7rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_34%),linear-gradient(180deg,#0b0b0b,#060606)]">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Uploaded room preview"
                    className="aspect-[1.08] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72))] p-6">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/44">Next step</p>
                      <p className="mt-2 max-w-[18rem] text-sm leading-6 text-white/68">
                        Finish overlay composition lands here next, tied to the active {activeProduct.productName} selection.
                      </p>
                    </div>
                    <img
                      src={activeProduct.finishAssets.faceImage}
                      alt={`${activeProduct.productName} finish sample`}
                      className="hidden h-16 w-24 rounded-[0.85rem] border border-white/12 object-cover md:block"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex aspect-[1.08] flex-col items-center justify-center px-8 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/42">
                    <ImagePlus size={26} />
                  </span>
                  <p className="mt-5 text-[0.8rem] font-semibold uppercase tracking-[0.28em] text-white/72">
                    Waiting for room image
                  </p>
                  <p className="mt-3 max-w-[18rem] text-sm leading-6 text-white/42">
                    This page is ready for the upload flow. Once a photo is added, we can build the finish overlay workflow around it.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
