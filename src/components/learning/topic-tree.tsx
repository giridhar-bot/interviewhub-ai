"use client";

import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface TopicNode {
  id: string;
  title: string;
  slug: string;
  children?: TopicNode[];
}

interface TopicTreeProps {
  nodes: TopicNode[];
  onSelect?: (node: TopicNode) => void;
  className?: string;
}

export function TopicTree({ nodes, onSelect, className }: TopicTreeProps) {
  return (
    <ul className={cn("space-y-0.5", className)}>
      {nodes.map((node) => (
        <TopicTreeNode key={node.id} node={node} onSelect={onSelect} />
      ))}
    </ul>
  );
}

function TopicTreeNode({ node, onSelect, depth = 0 }: { node: TopicNode; onSelect?: (n: TopicNode) => void; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect?.(node);
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-900",
          depth > 0 && "ml-4"
        )}
      >
        {hasChildren && (
          <ChevronRightIcon
            className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")}
          />
        )}
        {!hasChildren && <span className="w-3.5" />}
        <span className="text-gray-700 dark:text-gray-300">{node.title}</span>
      </button>
      {expanded && hasChildren && (
        <ul>
          {node.children!.map((child) => (
            <TopicTreeNode key={child.id} node={child} onSelect={onSelect} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
