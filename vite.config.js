import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
    rollupOptions: {
        input: {
        main: resolve(__dirname, 'index.html'),
        planLanding: resolve(__dirname, 'plan-landing.html'),
        planEcommerce: resolve(__dirname, 'plan-ecommerce.html'),
        onboarding: resolve(__dirname, 'onboarding.html'),
        onboardingEcommerce: resolve(__dirname, 'onboarding-ecommerce.html')
    },
    },
    },
})