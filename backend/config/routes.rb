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

    resources :users do
      collection do
        get 'me', to: 'users#me'
      end
      resources :teams_profile, only: [:index, :show]
    end
    
    resources :target_ages
    resources :sports_types
    resources :sports_disciplines
    resources :prefectures
    resources :searches, only: [:index]
    resources :users_profile, only: [:show]
    
    resources :chat_rooms do
      scope module: :chat_rooms do
        resources :chat_messages
        resources :chat_room_users, only: [:index, :create]
      end
    end
    post '/sessions', to: 'sessions#create'
    root to: proc { [204, {}, ['']] }
  end
end
