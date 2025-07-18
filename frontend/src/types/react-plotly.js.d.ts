declare module 'react-plotly.js' {
  import Plotly from 'plotly.js';
  import React from 'react';

  export interface PlotProps {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    useResizeHandler?: boolean;
    style?: React.CSSProperties;
    onInitialized?: (figure: Plotly.Figure) => void;
    onUpdate?: (figure: Plotly.Figure) => void;
  }

  const Plot: React.FC<PlotProps>;
  export default Plot;
}