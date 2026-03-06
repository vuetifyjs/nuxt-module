---
layout: home
sidebar: false

title: Vuetify Nuxt Module

hero:
  name: Vuetify + Nuxt
  text: Production UI without boilerplate
  tagline: Build faster with zero-config defaults, SSR-aware setup and fully customizable Vuetify runtime.
  image:
    src: /animated-logo.svg
    alt: Vuetify Nuxt Module
  actions:
    - theme: alt
      text: npx nuxi@latest module add vuetify-nuxt-module
      link: "#"
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/vuetifyjs/nuxt-module/

features:
  - icon: ⚡
    title: Zero-Config
    details: Sensible defaults for most Nuxt + Vuetify projects, ready in minutes
  - icon: 🛠️
    title: Runtime Extensibility
    details: Customize module behavior with Nuxt runtime and module hooks
    link: /guide/advanced/runtime-hooks
    linkText: Explore Hooks
  - icon: 💥
    title: SSR + Client Hints
    details: Smart SSR detection and HTTP Client Hints support for better UX
    link: /guide/features/ssr
    linkText: Learn SSR
  - icon: 🎨
    title: Flexible Styling
    details: Configure Vuetify SASS variables and styling pipeline to match your design system
    link: /guide/configuration/sass
    linkText: Style Guide
  - icon: 🧩
    title: Icon Strategy
    details: Pure CSS icons, icon fonts, SVG icons and multiple icon sets support
    link: /guide/features/icons/unocss-preset-icons
    linkText: Icons Setup
  - icon: 🌍
    title: i18n + Date Support
    details: Integrates with @nuxtjs/i18n and @date-io adapters for global-ready apps
    link: /guide/features/i18n
    linkText: Internationalization
---

<section class="home-benefits">
  <div class="home-benefits__head">
    <p class="home-benefits__kicker">Ship fast, stay in control</p>
    <h2>Everything you need to run Vuetify on Nuxt at scale.</h2>
  </div>
  <div class="home-benefits__grid">
    <article class="home-benefits__item">
      <p class="home-benefits__title">Works with Nuxt layers</p>
      <p>Share design systems and register custom configuration per layer or module.</p>
      <a href="/guide/advanced/layers-and-hooks">See layer workflow →</a>
    </article>
    <article class="home-benefits__item">
      <p class="home-benefits__title">DX-first defaults</p>
      <p>Auto-imported composables, optional directives, lab components and icon pipelines.</p>
      <a href="/guide/features/globals/">Browse feature docs →</a>
    </article>
  </div>
</section>
