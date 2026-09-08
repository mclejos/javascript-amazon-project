export const cart = [];

export function addToCart(productId, quantity) {
    let matchingItem;

    cart.forEach((cartitem) => {
      if (productId === cartitem.productId) {
        matchingItem = cartitem;

      }
    });
    
    if (matchingItem) {
      matchingItem.quantity += quantity;
    }else{
      cart.push({
        productId,
        quantity
      });
    }
}