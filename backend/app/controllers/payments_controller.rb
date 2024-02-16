class PaymentsController < ApplicationController
  before_action :authenticate, only: [:create_checkout_session, :payment_success]

  def create_checkout_session
    # Stripeのチェックアウトセッションを作成
    @session = Stripe::Checkout::Session.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'jpy',
          product_data: {
            name: 'chat_message_fee',
            # その他の商品情報
          },
          unit_amount: 500, # 適切な金額に設定
        },
        price: 'price_id', # Stripeダッシュボードで設定した価格ID
        quantity: 1,
      }],
      mode: 'subscription', # 定期課金の場合
      success_url: `http://localhost:3000/chat_rooms/#{chat_room_id}/chat_messages`,
      cancel_url: 'https://localhost:3000/chat_rooms',
    })

    render json: { session_url: session.url }
  end

  def payment_success
    # Stripeからのデータを取得（例: params[:data] や params[:type]）
    # ここで受け取るデータはStripeのWebhook設定に依存します

    # 支払いに関連するユーザーを特定するロジックをここに実装
    # 例: user_id = params[:data][:object][:customer]
    user_id = ... # 実際のユーザーIDを取得するコード

    # ユーザーを検索し、payment_completedを更新
    user = User.find_by(id: user_id)
  
    if user
      user.update!(payment_completed: true)
      head :ok
    else
      render json: { error: "User not found" }, status: :not_found
    end
  end
end
