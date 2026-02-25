import React from 'react';
import './CategoriesSection.css';
import { useNavigate } from 'react-router-dom';

const categories = [
	{
		name: 'Scented Candles',
		description: 'Explore our range of aromatic candles for every mood.',
		url: '/shop?scented',
		icon: '🕯️',
	},
	{
		name: 'Jar Candles',
		description: 'Beautiful jar candles for cozy spaces.',
		url: '/shop?type=jar',
		icon: '🏺',
	},
	{
		name: 'Pillar Candles',
		description: 'Classic pillar candles for elegant decor.',
		url: '/shop?type=pillar',
		icon: '🕯️',
	},
	{
		name: 'Gift Sets',
		description: 'Perfect candle gift sets for loved ones.',
		url: '/shop?category=gift',
		icon: '🎁',
	},
];

export default function CategoriesSection() {
	const navigate = useNavigate();
	return (
		<section className="categories-section">
			<div className="categories-header">
				<h2>Shop by Category</h2>
				<p>Find the perfect candle for any occasion or mood.</p>
			</div>
			<div className="categories-grid">
				{categories.map((cat, idx) => (
					<div
						className="category-card"
						key={cat.name}
						onClick={() => navigate(cat.url)}
						style={{ cursor: 'pointer' }}
					>
						<div className="category-icon" style={{ fontSize: '2.5rem' }}>{cat.icon}</div>
						<h3>{cat.name}</h3>
						<p>{cat.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
