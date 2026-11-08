// Records attributes now and returns a function that puts them back, for destroy().
export function snapshotAttributes(elements, names) {
  const saved = elements.flatMap((element) =>
    names.map((name) => [element, name, element.getAttribute(name)]),
  );
  return () => {
    for (const [element, name, value] of saved) {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    }
  };
}
