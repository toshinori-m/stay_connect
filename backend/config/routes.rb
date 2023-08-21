Rails.application.routes.draw do
  constraints format: :json do
    mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'auth/registrations'
    }

    resources :target_ages do
      resource :team_target_ages, only: ['create']
    end

    resources :users
    resources :teams
    resources :sports_types
  end
end
