import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0 py-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item${index === items.length - 1 ? ' active' : ''}`}
            {...(index === items.length - 1 ? { 'aria-current': 'page' } : {})}
          >
            {index < items.length - 1 && item.href ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
