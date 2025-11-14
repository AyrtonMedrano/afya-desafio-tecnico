import React from 'react';
import {
  CardWrapper,
  BestOfferBadge,
  RadioInput,
  Title,
  Price,
  Description,
} from './CardProduct.styled';

interface CardProductProps {
  title: string;
  price: number;
  pricePer: string;
  description: string;
  bestOffer?: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const CardProduct: React.FC<CardProductProps> = ({
  title,
  price,
  pricePer,
  description,
  bestOffer = false,
  isSelected,
  onSelect,
}) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

  return (
    <CardWrapper isSelected={isSelected}>
      {bestOffer && <BestOfferBadge>Melhor oferta</BestOfferBadge>}
      <RadioInput
        type="radio"
        name="product-plan"
        checked={isSelected}
        onChange={onSelect}
        onClick={(e) => e.stopPropagation()}
      />
      <Title>{title}</Title>
      <Price>
        {formattedPrice} <span>/{pricePer}</span>
      </Price>
      <Description>{description}</Description>
    </CardWrapper>
  );
};

export default CardProduct;