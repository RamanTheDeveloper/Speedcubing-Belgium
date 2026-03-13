interface EventBadgeProps {
  event: string;
}

export default function EventBadge({ event }: EventBadgeProps) {
  return (
    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200">
      {event}
    </span>
  );
}