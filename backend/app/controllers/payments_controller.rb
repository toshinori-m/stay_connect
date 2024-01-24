class PaymentsController < ApplicationController
  before_action :set_cart, only: %i[checkout]
  
  def checkout
    line_items = []
    
    @cart.line_items.each do |line_item|
      line_items << {
        price_data: {
          unit_amount: line_item.product.price,
          currency: 'jpy',
          product_data: {
            name: line_item.product.name,
            description: line_item.product.description,
          }
        },
        quantity: line_item.quantity,
      }
    end
    
    @session = Stripe::Checkout::Session.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: root_url,
      cancel_url: carts_url,
    })
  end
end
