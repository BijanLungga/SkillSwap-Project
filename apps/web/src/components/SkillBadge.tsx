import React from 'react';
import { X } from 'lucide-react';

interface SkillBadgeProps {
  skillName: string;
  skillType: 'HAVE' | 'WANT';
  onDelete?: () => void;
}

export default function SkillBadge({ skillName, skillType, onDelete }: SkillBadgeProps) {
  const isHave = skillType === 'HAVE';
  const colorClasses = isHave
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-blue-100 text-blue-800 border-blue-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
      {skillName}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={`flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center focus:outline-none focus:text-white ${
            isHave ? 'text-green-600 hover:bg-green-200 hover:text-green-900' : 'text-blue-600 hover:bg-blue-200 hover:text-blue-900'
          }`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
