function normalizeHex(hex) {
  const value = hex.replace("#", "");

  if (value.length === 3) {
    return value
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  return value;
}

function getRelativeLuminance(hex) {
  const normalized = normalizeHex(hex);
  const rgb = [0, 2, 4].map((index) => {
    const channel = parseInt(normalized.slice(index, index + 2), 16) / 255;

    if (channel <= 0.03928) {
      return channel / 12.92;
    }

    return ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(foreground, background) {
  const luminanceA = getRelativeLuminance(foreground);
  const luminanceB = getRelativeLuminance(background);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return (lighter + 0.05) / (darker + 0.05);
}

describe("audited color contrast pairs", () => {
  test("blog accent button color passes AA with white text", () => {
    expect(getContrastRatio("#ffffff", "#835fc9")).toBeGreaterThanOrEqual(4.5);
  });

  test("blog accent text passes AA on white surfaces", () => {
    expect(getContrastRatio("#7f59c7", "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  test("blog accent text passes AA on pale blue surfaces", () => {
    expect(getContrastRatio("#7f59c7", "#f3f7ff")).toBeGreaterThanOrEqual(4.5);
  });

  test("blog pink accent text passes AA on white surfaces", () => {
    expect(getContrastRatio("#c24462", "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  test("blog pink accent text passes AA on pale blue surfaces", () => {
    expect(getContrastRatio("#c24462", "#f3f7ff")).toBeGreaterThanOrEqual(4.5);
  });

  test("blog muted text passes AA on white surfaces", () => {
    expect(getContrastRatio("#707070", "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  test("blog muted text passes AA on pale blue surfaces", () => {
    expect(getContrastRatio("#707070", "#f3f7ff")).toBeGreaterThanOrEqual(4.5);
  });

  test("shared form titles and auth text pass AA on dark surfaces", () => {
    expect(getContrastRatio("#d9d9d9", "#0f1111")).toBeGreaterThanOrEqual(4.5);
  });

  test("shared form labels pass AA on dark input surfaces", () => {
    expect(getContrastRatio("#948e8e", "#242728")).toBeGreaterThanOrEqual(4.5);
  });

  test("gallery secondary hashtag text passes AA on dark surfaces", () => {
    expect(getContrastRatio("#ababab", "#0f1111")).toBeGreaterThanOrEqual(4.5);
  });

  test("shared submit button text passes AA on gallery blue surfaces", () => {
    expect(getContrastRatio("#0f1111", "#7cc6fb")).toBeGreaterThanOrEqual(4.5);
  });

  test("gallery upload remove button passes AA after blue adjustment", () => {
    expect(getContrastRatio("#ffffff", "#396675")).toBeGreaterThanOrEqual(4.5);
  });
});
