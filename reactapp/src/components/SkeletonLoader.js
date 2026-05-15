// src/components/SkeletonLoader.js
import React from 'react';

const SkeletonBox = ({ width = '100%', height = '20px', style = {} }) => (
  <div className="skeleton" style={{ width, height, ...style }} />
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <SkeletonBox height="14px" width="60%" />
    <SkeletonBox height="36px" width="40%" style={{ marginTop: '8px' }} />
    <SkeletonBox height="12px" width="80%" style={{ marginTop: '8px' }} />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="skeleton-table">
    <SkeletonBox height="44px" style={{ borderRadius: '6px', marginBottom: '4px' }} />
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonBox key={i} height="52px" style={{ borderRadius: '4px', marginBottom: '4px', opacity: 1 - i * 0.12 }} />
    ))}
  </div>
);

export const SkeletonStats = () => (
  <div className="stats-grid">
    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

const SkeletonLoader = () => (
  <div className="page-content">
    <SkeletonStats />
    <SkeletonTable />
  </div>
);

export default SkeletonLoader;
