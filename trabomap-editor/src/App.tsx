import { useMemo, useState } from "react";
import { parseKeymapTrackball } from "./lib/parseTrackball";
import { applyTrackballConfig } from "./lib/serializeTrackball";
import type { TrackballConfig } from "./types/trackball";
import "./App.css";

function formatBinding(binding: string): string {
  if (binding === "&none") return "（なし）";
  return binding.replace(/^&kp\s+/, "");
}

export default function App() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [config, setConfig] = useState<TrackballConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const flashHint = useMemo(() => {
    if (!source || !config) return null;
    return "トラックボール設定を変更した場合 → 右半分（roBa_R）をフラッシュ";
  }, [source, config]);

  async function handleFile(file: File) {
    const text = await file.text();
    try {
      const parsed = parseKeymapTrackball(text);
      setFileName(file.name);
      setSource(text);
      setConfig(parsed.config);
      setError(null);
    } catch (e) {
      setFileName(null);
      setSource(null);
      setConfig(null);
      setError(e instanceof Error ? e.message : "キーマップの読み込みに失敗しました");
    }
  }

  function handleDownload() {
    if (!source || !config) return;
    const output = applyTrackballConfig(source, config);
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName ?? "roBa.keymap";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <header>
        <h1>TraboMap Editor</h1>
        <p className="subtitle">roBa 向けトラックボール設定エディタ（Phase 0）</p>
      </header>

      <section className="panel">
        <label className="upload">
          <span>.keymap ファイルを選択</span>
          <input
            type="file"
            accept=".keymap,text/plain"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </label>
        {error && <p className="error">{error}</p>}
        {fileName && !error && (
          <p className="meta">
            読み込み: <code>{fileName}</code>
          </p>
        )}
      </section>

      {config && (
        <>
          <section className="panel">
            <h2>トラックボール設定</h2>
            <dl className="kv">
              <dt>オートマウスレイヤー</dt>
              <dd>Layer {config.automouseLayer}</dd>
              <dt>スクロールレイヤー</dt>
              <dd>{config.scrollLayers.map((l) => `Layer ${l}`).join(", ")}</dd>
            </dl>

            {config.swipes.map((swipe) => (
              <div key={swipe.name} className="swipe">
                <h3>{swipe.name}</h3>
                <p>対象レイヤー: {swipe.layers.join(", ")}</p>
                <ul>
                  {swipe.bindings.map((binding, i) => (
                    <li key={i}>
                      方向 {i + 1}: {formatBinding(binding)}
                    </li>
                  ))}
                </ul>
                <p className="timing">
                  tick={swipe.tick ?? "—"} / wait-ms={swipe.waitMs ?? "—"} / tap-ms=
                  {swipe.tapMs ?? "—"}
                </p>
              </div>
            ))}
          </section>

          <section className="panel actions">
            <button type="button" onClick={handleDownload}>
              .keymap をダウンロード
            </button>
            {flashHint && <p className="hint">{flashHint}</p>}
          </section>
        </>
      )}
    </div>
  );
}
