// @ts-check
import { defineConfig } from "astro/config";

/**
 * Cuida Home Care — site estático.
 *
 * Restrições que esta configuração serve (docs/architecture.md):
 * - NFR2: HTML entregue pronto, sem render no cliente. Zero JS no bundle.
 * - NFR3: CSS crítico inline no <head>.
 * - NFR1: PageSpeed mobile >= 90, FCP e LCP < 1,5s.
 */
export default defineConfig({
  output: "static",
  site: "https://cuidahomecare.com",
  trailingSlash: "never",
  build: {
    // O CSS do projeto é pequeno o bastante para ser inlinado por inteiro,
    // o que elimina uma requisição do caminho crítico.
    // Se passar de 15 KB comprimido, trocar para 'auto' (docs/architecture.md §5.3).
    inlineStylesheets: "always",
  },
  image: {
    // Sem serviço de imagem em runtime: tudo é processado no build.
    responsiveStyles: true,
  },
});
