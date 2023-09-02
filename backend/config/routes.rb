Rails.application.routes.draw do
  constraints format: :json do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'auth/registrations'
    }

    resources :target_ages do
      resource :team_target_ages, only: [:create]
      resource :recruitment_target_ages, only: [:create]
    end

    resources :chat_rooms do
      resource :chat_room_users, only: [:create]
    end

    namespace :auth do
      resources :users, except: [:create, :destroy]
    end

    resources :teams
    resources :sports_types
    resources :recruitments
    resources :prefectures
    resources :chat_messages
  end
end
