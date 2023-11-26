Rails.application.routes.draw do
  constraints format: :json do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'auth/registrations'
    }

    namespace :auth do
      resources :users, only: [:update, :index, :show], defaults: { format: 'json' }
    end

    resources :recruitments do
      resources :sports_disciplines, only: [:index], controller: 'recruitment_sports_disciplines'
      resources :target_ages, only: [:index], controller: 'recruitment_target_ages'
    end

    resources :teams, defaults: { format: 'json' }  do
      resources :sports_disciplines, only: [:index], controller: 'team_sports_disciplines'
      resources :target_ages, only: [:index], controller: 'team_target_ages'
    end

    resources :target_ages
    resources :sports_types
    resources :sports_disciplines
    resources :prefectures
    
    resources :chat_rooms, defaults: { format: 'json' } do
      member do
        post 'add_user', to: 'chat_rooms#add_user'
      end
      
      scope module: :chat_rooms do
        resources :chat_messages, defaults: { format: 'json' }
        resources :users, only: [:index, :create, :destroy], controller: 'chat_room_users'
      end
    end
  end
end
