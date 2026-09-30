import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { DEPARTMENTS } from '@/utils/constants';

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartments: string[];
  onDepartmentToggle: (dept: string) => void;
  onResetDepartments: () => void;
  sortBy: 'deadline' | 'newest';
  onSortChange: (sort: 'deadline' | 'newest') => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedDepartments,
  onDepartmentToggle,
  onResetDepartments,
  sortBy,
  onSortChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        marginBottom: '1.5rem',
        backgroundColor: 'var(--bg-card)',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        {/* Search input */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search projects by title, code, or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.75rem 0.45rem 2.3rem',
              fontSize: '0.8125rem',
              color: 'var(--text-main)',
              outline: 'none',
            }}
          />
        </div>

        {/* Sort & Quick Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <SlidersHorizontal size={14} />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'deadline' | 'newest')}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.3rem 0.6rem',
                fontSize: '0.8125rem',
                color: 'var(--text-main)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="deadline">Nearest deadline</option>
              <option value="newest">Recently added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Multi-select Department Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
        <button
          type="button"
          onClick={onResetDepartments}
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: selectedDepartments.length === 0 ? 'var(--brand-primary)' : 'var(--bg-elevated)',
            color: selectedDepartments.length === 0 ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 500,
            border: '1px solid transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          All Departments
        </button>

        {DEPARTMENTS.map((dept) => {
          const isSelected = selectedDepartments.includes(dept);
          return (
            <button
              key={dept}
              type="button"
              onClick={() => onDepartmentToggle(dept)}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'var(--bg-input)',
                color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: `1px solid ${isSelected ? 'var(--brand-primary-border)' : 'var(--border-subtle)'}`,
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {dept}
            </button>
          );
        })}

        {selectedDepartments.length > 0 && (
          <button
            onClick={onResetDepartments}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              padding: '0.2rem 0.4rem',
              cursor: 'pointer',
              marginLeft: '0.25rem',
            }}
            title="Clear department filters"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
