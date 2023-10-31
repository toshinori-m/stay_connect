Rails.application.routes.draw do
  constraints format: :json do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'auth/registrations'
    }

    namespace :auth do
      resources :users, only: [:update, :index, :show], defaults: { format: 'json' }
      resources :users, except: [:create, :destroy]
    end

    resources :teams
    resources :target_ages
    resources :sports_types
    resources :sports_disciplines
    resources :recruitments
    resources :prefectures
    resources :chat_rooms
    resources :chat_messages
    resources :recruitment_sports_disciplines, only: [:index]
    resources :recruitment_target_ages, only: [:index]
  end
end
