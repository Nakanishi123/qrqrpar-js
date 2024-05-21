import init, {
  EcLevel,
  QrShape,
  QrStyle,
  QrType,
  RmqrStrategy,
  make_qr,
  make_qr_png,
} from "qrqrpar-js";
import { useEffect, useRef, useState } from "react";

function QrGen() {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const ecRef = useRef<HTMLSelectElement>(null);
  const strategyRef = useRef<HTMLSelectElement>(null);
  const shapeRef = useRef<HTMLSelectElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const bgColorRef = useRef<HTMLInputElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const marginRef = useRef<HTMLInputElement>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [errorText, setErrorText] = useState("No message");

  const getParams = () => {
    const message = messageRef.current?.value;
    const type = typeRef.current?.value;
    const ec = ecRef.current?.value;
    const strategy = strategyRef.current?.value;
    const shape = shapeRef.current?.value;
    const color = colorRef.current?.value;
    const bgColor = bgColorRef.current?.value;
    const width = widthRef.current?.value;
    const margin = marginRef.current?.value;

    if (!type || !ec || !strategy) return;
    if (!shape || !color || !bgColor || !width || !margin) return;

    const style = new QrStyle(
      color,
      bgColor,
      Number(shape),
      Number(width),
      Number(margin)
    );
    return {
      text: message,
      qrtype: Number(type),
      eclevel: Number(ec),
      style: style,
      strategy: Number(strategy),
    };
  };

  const onchange = () => {
    const params = getParams();
    if (!params) return;
    if (!params.text) {
      setErrorText("No message");
      setQrUrl("");
      return;
    }
    try {
      const qr_svg = make_qr(
        params.text,
        params.qrtype,
        params.eclevel,
        params.style,
        params.strategy
      );
      const svg_blob = new Blob([qr_svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svg_blob);
      setErrorText("");
      setQrUrl(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setErrorText(e);
      setQrUrl("");
    }
  };

  const download = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qr.svg";
    link.click();
  };

  const downloadPng = () => {
    const params = getParams();
    if (!params) return;
    if (!params.text) {
      setErrorText("No message");
      setQrUrl("");
      return;
    }
    try {
      const qr_png = make_qr_png(
        params.text,
        params.qrtype,
        params.eclevel,
        params.style,
        params.strategy
      );
      const png_blob = new Blob([qr_png], { type: "image/png" });
      const url = URL.createObjectURL(png_blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qr.png";
      link.click();
    } catch (e: any) {}
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mt-10 text-4xl">Qr Generator</h1>
      <form className="my-2 block w-full p-2.5" onChange={onchange}>
        <div className="mb-2">
          <label className="block text-lg font-medium text-gray-900">
            Your message
          </label>
          <textarea
            ref={messageRef}
            className="block w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="mb-2 flex flex-row space-x-4">
          <div className="flex-1 ">
            <label className="block text-lg font-medium text-gray-900">
              Qr type
            </label>
            <select
              ref={typeRef}
              className="block w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={QrType.Rmqr}>rMQR</option>
              <option value={QrType.Qr}>Qr</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-900">
              Error correction level
            </label>
            <select
              ref={ecRef}
              className="block w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={EcLevel.H}>H</option>
              <option value={EcLevel.Q}>Q</option>
              <option value={EcLevel.M}>M</option>
              <option value={EcLevel.L}>L</option>
            </select>
          </div>
        </div>
        <div className="mb-2 flex flex-row space-x-4">
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-900">
              rMQR Strategy
            </label>
            <select
              ref={strategyRef}
              className="block w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={RmqrStrategy.Area}>Minimize area</option>
              <option value={RmqrStrategy.Width}>Minimize width</option>
              <option value={RmqrStrategy.Height}>Minimize height</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-900">
              Qr style
            </label>
            <select
              ref={shapeRef}
              className="block w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={QrShape.Square}>Square</option>
              <option value={QrShape.Round}>Round</option>
            </select>
          </div>
        </div>
        <div className="mb-2 flex flex-row space-x-4">
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-900">
              Color
            </label>
            <input
              ref={colorRef}
              defaultValue="#000000"
              type="color"
              className="block h-10 w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-900">
              Background color
            </label>
            <input
              ref={bgColorRef}
              defaultValue={"#ffffff"}
              type="color"
              className="block h-10 w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-2 flex flex-row space-x-4">
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-900">
              Width
            </label>
            <input
              ref={widthRef}
              defaultValue={512}
              min={27}
              type="number"
              className="block h-10 w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-lg font-medium text-gray-900">
              Margin
            </label>
            <input
              ref={marginRef}
              defaultValue={2.0}
              min={0.0}
              step="0.1"
              type="number"
              className="block h-10 w-full rounded-lg border border-gray-500 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </form>

      {errorText ? (
        <p className="mb-2 text-xl font-bold text-red-600">{errorText}</p>
      ) : (
        <>
          <img src={qrUrl} alt="qr" className="w-full p-2.5" />
          <div className="qr flex gap-2">
            <button
              onClick={download}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Download SVG
            </button>
            <button
              onClick={downloadPng}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Download PNG
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default QrGen;
