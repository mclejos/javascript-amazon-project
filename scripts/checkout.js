import {
  cart,
  removeFromCart,
  updateCartItemQuantity
} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

let cartSummaryHTML = '';

const today = dayjs();
const deliveryDate = today.add(7, 'days');
deliveryDate.format('dddd, MMMM D');

function updateCartQuantity() {
  let quantity = 0;

  cart.forEach((cartItem) => {
    quantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = `${quantity} items`;
}

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => { 
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliverOptionId = cartItem.deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliverOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDate, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-link"
            data-product-id="${matchingProduct.id}">
            Update
          </span>
          <span class="quantity-edit js-quantity-edit-${matchingProduct.id}">
            <input class="quantity-input js-quantity-input-${matchingProduct.id}"
              type="number" min="1" value="${cartItem.quantity}">
            <button class="save-quantity-button js-save-link"
              data-product-id="${matchingProduct.id}">
              Save
            </button>
          </span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
      </div>
    </div>
  </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDate, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0 
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
        <div class="delivery-option">
          <input type="radio" 
            ${isChecked ? 'checked':''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString} Shipping
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
  });

  return html;
}

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

updateCartQuantity();


document.querySelectorAll('.js-delete-link')
  .forEach((link)=>{
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      container.remove();
      updateCartQuantity();
    });
  });

document.querySelectorAll('.js-update-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const editControls = document.querySelector(
        `.js-quantity-edit-${productId}`
      );

      link.style.display = 'none';
      editControls.classList.add('quantity-edit-visible');
      editControls.querySelector('input').focus();
    });
  });

document.querySelectorAll('.js-save-link')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const editControls = document.querySelector(
        `.js-quantity-edit-${productId}`
      );
      const input = editControls.querySelector('input');
      const quantity = Number(input.value);

      if (!Number.isInteger(quantity) || quantity < 1) {
        input.focus();
        return;
      }

      updateCartItemQuantity(productId, quantity);
      editControls.parentElement.querySelector('.quantity-label').innerHTML = quantity;
      editControls.classList.remove('quantity-edit-visible');
      document.querySelector(
        `.js-update-link[data-product-id="${productId}"]`
      ).style.display = '';
      updateCartQuantity();
    });
  });
  