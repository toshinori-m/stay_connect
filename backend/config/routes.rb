Rails.application.routes.draw do
  defaults format: :json do
  #   mount_devise_token_auth_for 'User', at: 'auth', controllers: {
  #     registrations: 'auth/registrations'
  #   }

    resources :recruitments do
      resources :sports_disciplines, only: [:index], controller: 'recruitment_sports_disciplines'
      resources :target_ages, only: [:index], controller: 'recruitment_target_ages'
    end

    resources :teams do
      resources :sports_disciplines, only: [:index], controller: 'team_sports_disciplines'
      resources :target_ages, only: [:index], controller: 'team_target_ages'
    end
    resources :users
    resources :target_ages
    resources :sports_types
    resources :sports_disciplines
    resources :prefectures
    
    resources :chat_rooms do
      scope module: :chat_rooms do
        resources :chat_messages
        resources :chat_room_users, only: [:index, :create]
      end
    end

    get 'searches', to: 'searches#index'
    get 'users_profile/:id', to: 'users_profile#show'
  end
end
