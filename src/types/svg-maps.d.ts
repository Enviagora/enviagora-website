declare module '@svg-maps/brazil' {
  interface SvgMapLocation {
    id: string;
    name: string;
    path: string;
  }
  const map: {
    label: string;
    viewBox: string;
    locations: SvgMapLocation[];
  };
  export default map;
}
