import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface RidgePlotProps {
  data: { health_unit_name?: string | null; score?: number | null }[];
}

export function RidgePlot({ data }: RidgePlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries.length > 0) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    // Filter valid data
    const validData = data.filter(d => d.health_unit_name && typeof d.score === 'number');
    
    // Group by UBS
    const grouped = d3.group(validData, d => d.health_unit_name as string);
    
    // Sort health units logically or alphabetically
    const units = Array.from(grouped.keys()).sort();

    const topUnitsRaw = units.map(u => {
      const scores = grouped.get(u)!.map(d => d.score as number);
      return {
        unit: u,
        count: scores.length,
        mean: d3.mean(scores) || 0
      };
    })
    .sort((a,b) => b.count - a.count)
    .slice(0, 15); // Adjust this limit depending on height available

    // Re-sort descending by mean score
    const topUnits = topUnitsRaw
      .sort((a,b) => b.mean - a.mean)
      .map(d => d.unit);

    // Define thresholds from 0 to 10
    const thresholds = d3.range(0, 10.1, 0.2);

    // Compute KDE for each unit
    const kde = (kernel: (v: number) => number, thresholds: number[]) => {
      return (V: number[]) => {
        return thresholds.map(t => [t, d3.mean(V, v => kernel(t - v)) || 0]);
      };
    };

    const epanechnikov = (bandwidth: number) => {
      return (v: number) => {
        return Math.abs(v /= bandwidth) <= 1 ? 0.75 * (1 - v * v) / bandwidth : 0;
      };
    };

    const kdeEstimator = kde(epanechnikov(1.0), thresholds); // Bandwidth of 1 point (on scale 0-10)

    const densityData = topUnits.map(unit => {
      const unitScores = grouped.get(unit)!.map(d => d.score as number);
      const density = kdeEstimator(unitScores);
      return {
        unit,
        density,
        count: unitScores.length
      };
    });

    return { densityData, units: topUnits };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0 || chartData.densityData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 120, right: 30, bottom: 40, left: 160 }; // Left margin for unit names
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X Scale: 0 to 10
    const x = d3.scaleLinear()
      .domain([0, 10])
      .range([0, width]);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(10))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("y2", -height)
          .attr("stroke-opacity", 0.1))
      .selectAll("text")
      .attr("font-family", "Inter, sans-serif")
      .attr("fill", "#64748b");
      
    // Add X axis title
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-family", "Inter, sans-serif")
      .attr("fill", "#64748b")
      .text("Escore (0 a 10)");

    // Y Scale (for positioning the groups)
    const y = d3.scaleBand()
      .domain(chartData.units)
      .range([0, height])
      .paddingInner(1);

    // Compute Y scale for the density peaks.
    // The peak height should overlap slightly with the unit above it.
    let maxDensity = 0;
    chartData.densityData.forEach(d => {
      d.density.forEach(pt => {
         if (pt[1] > maxDensity) maxDensity = pt[1];
      });
    });

    // 2.5 means the peak will reach 2.5 rows up.
    const overlapFactor = 2.5; 
    const step = y.step() || (height / (chartData.units.length || 1));
    const shiftAxis = -step * overlapFactor; 
    
    const yDensity = d3.scaleLinear()
      .domain([0, maxDensity])
      .range([0, shiftAxis]); 

    // Add Area
    const area = d3.area<[number, number]>()
      .x(d => x(d[0]))
      .y0(0)
      .y1(d => yDensity(d[1]))
      .curve(d3.curveBasis);

    const line = d3.line<[number, number]>()
        .x(d => x(d[0]))
        .y(d => yDensity(d[1]))
        .curve(d3.curveBasis);

    // Color Gradients
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "ridge-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");
      
    // 0-4.9 Red, 5-6.5 Yellow, 6.6+ Green
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#ef4444");
    gradient.append("stop").attr("offset", "49%").attr("stop-color", "#ef4444");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "#eab308");
    gradient.append("stop").attr("offset", "65%").attr("stop-color", "#eab308");
    gradient.append("stop").attr("offset", "66%").attr("stop-color", "#22c55e");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#16a34a");

    const unitGroups = g.selectAll(".unit-group")
      .data(chartData.densityData)
      .enter().append("g")
      .attr("class", "unit-group")
      .attr("transform", d => `translate(0, ${y(d.unit) || 0})`);

    // Draw the areas
    unitGroups.append("path")
      .attr("fill", "url(#ridge-gradient)")
      .attr("fill-opacity", 0.75)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("d", d => area(d.density as [number, number][]));

    // Draw the top line
    unitGroups.append("path")
      .attr("fill", "none")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.5)
      .attr("d", d => line(d.density as [number, number][]));

    // Reference line at 6.6
    g.append("line")
      .attr("x1", x(6.6))
      .attr("x2", x(6.6))
      .attr("y1", shiftAxis) // start higher so it covers the top ridge
      .attr("y2", height)
      .attr("stroke", "#16a34a")
      .attr("stroke-dasharray", "4 4")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.6);

    g.append("text")
      .attr("x", x(6.6))
      .attr("y", shiftAxis - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", "#16a34a")
      .attr("font-weight", "600")
      .text("Adequado (6.6)");

    // Reference line at 5.0
    g.append("line")
      .attr("x1", x(5.0))
      .attr("x2", x(5.0))
      .attr("y1", shiftAxis)
      .attr("y2", height)
      .attr("stroke", "#eab308")
      .attr("stroke-dasharray", "4 4")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.6);
      
    g.append("text")
      .attr("x", x(5.0))
      .attr("y", shiftAxis - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", "#ca8a04")
      .attr("font-weight", "600")
      .text("Atenção (5.0)");

    // Labels with dynamic truncation and counts
    unitGroups.append("text")
      .attr("x", -10)
      .attr("y", 0)
      .attr("dy", "0.3em")
      .attr("text-anchor", "end")
      .attr("font-size", "11px")
      .attr("font-family", "Inter, sans-serif")
      .attr("fill", "#334155")
      .attr("font-weight", "500")
      .text(d => {
        const title = d.unit.replace(/^(USF|UBS|ESF|Centro de Saúde)\s+/i, ''); // Strip common prefixes for clarity
        return title.length > 20 ? title.substring(0, 18) + "..." : title;
      })
      .append("tspan")
      .attr("font-size", "9px")
      .attr("fill", "#94a3b8")
      .attr("font-weight", "400")
      .text(d => ` (n=${d.count})`);

  }, [chartData, dimensions]);

  if (chartData.densityData.length === 0) {
     return (
       <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
         Não há dados suficientes (mínimo de respostas com identificação de unidade e score).
       </div>
     );
  }

  return (
    <div ref={containerRef} className="w-full h-[500px]">
      <svg ref={svgRef} width="100%" height="100%" style={{ overflow: 'visible' }} />
    </div>
  );
}
