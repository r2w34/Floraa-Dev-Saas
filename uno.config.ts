import { globSync } from 'fast-glob';
import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

const iconPaths = globSync('./icons/*.svg');

const collectionName = 'floraa';

const customIconCollection = iconPaths.reduce(
  (acc, iconPath) => {
    const [iconName] = basename(iconPath).split('.');

    acc[collectionName] ??= {};
    acc[collectionName][iconName] = async () => fs.readFile(iconPath, 'utf8');

    return acc;
  },
  {} as Record<string, Record<string, () => Promise<string>>>,
);

const BASE_COLORS = {
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  accent: {
    50: '#F8F5FF',
    100: '#F0EBFF',
    200: '#E1D6FF',
    300: '#CEBEFF',
    400: '#B69EFF',
    500: '#9C7DFF',
    600: '#8A5FFF',
    700: '#7645E8',
    800: '#6234BB',
    900: '#502D93',
    950: '#2D1959',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  orange: {
    50: '#FFFAEB',
    100: '#FEEFC7',
    200: '#FEDF89',
    300: '#FEC84B',
    400: '#FDB022',
    500: '#F79009',
    600: '#DC6803',
    700: '#B54708',
    800: '#93370D',
    900: '#792E0D',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
  pink: {
    50: '#FFF5F9',
    100: '#FFEBF2',
    200: '#FFD6E6',
    300: '#FFB8D1',
    400: '#FF8FB8',
    500: '#ff74ab',
    600: '#E6508A',
    700: '#CC3D6F',
    800: '#B32A54',
    900: '#991E3F',
    950: '#4D0F1F',
  },
};

const COLOR_PRIMITIVES = {
  ...BASE_COLORS,
  alpha: {
    white: generateAlphaPalette(BASE_COLORS.white),
    gray: generateAlphaPalette(BASE_COLORS.gray[900]),
    red: generateAlphaPalette(BASE_COLORS.red[500]),
    accent: generateAlphaPalette(BASE_COLORS.accent[500]),
    pink: generateAlphaPalette(BASE_COLORS.pink[500]),
  },
};

export default defineConfig({
  shortcuts: {
    'floraa-ease-cubic-bezier': 'ease-[cubic-bezier(0.4,0,0.2,1)]',
    'transition-theme': 'transition-[background-color,border-color,color] duration-150 floraa-ease-cubic-bezier',
    kdb: 'bg-floraa-elements-code-background text-floraa-elements-code-text py-1 px-1.5 rounded-md',
    'max-w-chat': 'max-w-[var(--chat-max-width)]',
  },
  rules: [
    /**
     * This shorthand doesn't exist in Tailwind and we overwrite it to avoid
     * any conflicts with minified CSS classes.
     */
    ['b', {}],
  ],
  theme: {
    colors: {
      ...COLOR_PRIMITIVES,
      floraa: {
        elements: {
          borderColor: 'var(--floraa-elements-borderColor)',
          borderColorActive: 'var(--floraa-elements-borderColorActive)',
          background: {
            depth: {
              1: 'var(--floraa-elements-bg-depth-1)',
              2: 'var(--floraa-elements-bg-depth-2)',
              3: 'var(--floraa-elements-bg-depth-3)',
              4: 'var(--floraa-elements-bg-depth-4)',
            },
          },
          textPrimary: 'var(--floraa-elements-textPrimary)',
          textSecondary: 'var(--floraa-elements-textSecondary)',
          textTertiary: 'var(--floraa-elements-textTertiary)',
          code: {
            background: 'var(--floraa-elements-code-background)',
            text: 'var(--floraa-elements-code-text)',
          },
          button: {
            primary: {
              background: 'var(--floraa-elements-button-primary-background)',
              backgroundHover: 'var(--floraa-elements-button-primary-backgroundHover)',
              text: 'var(--floraa-elements-button-primary-text)',
            },
            secondary: {
              background: 'var(--floraa-elements-button-secondary-background)',
              backgroundHover: 'var(--floraa-elements-button-secondary-backgroundHover)',
              text: 'var(--floraa-elements-button-secondary-text)',
            },
            danger: {
              background: 'var(--floraa-elements-button-danger-background)',
              backgroundHover: 'var(--floraa-elements-button-danger-backgroundHover)',
              text: 'var(--floraa-elements-button-danger-text)',
            },
          },
          item: {
            contentDefault: 'var(--floraa-elements-item-contentDefault)',
            contentActive: 'var(--floraa-elements-item-contentActive)',
            contentAccent: 'var(--floraa-elements-item-contentAccent)',
            contentDanger: 'var(--floraa-elements-item-contentDanger)',
            backgroundDefault: 'var(--floraa-elements-item-backgroundDefault)',
            backgroundActive: 'var(--floraa-elements-item-backgroundActive)',
            backgroundAccent: 'var(--floraa-elements-item-backgroundAccent)',
            backgroundDanger: 'var(--floraa-elements-item-backgroundDanger)',
          },
          actions: {
            background: 'var(--floraa-elements-actions-background)',
            code: {
              background: 'var(--floraa-elements-actions-code-background)',
            },
          },
          artifacts: {
            background: 'var(--floraa-elements-artifacts-background)',
            backgroundHover: 'var(--floraa-elements-artifacts-backgroundHover)',
            borderColor: 'var(--floraa-elements-artifacts-borderColor)',
            inlineCode: {
              background: 'var(--floraa-elements-artifacts-inlineCode-background)',
              text: 'var(--floraa-elements-artifacts-inlineCode-text)',
            },
          },
          messages: {
            background: 'var(--floraa-elements-messages-background)',
            linkColor: 'var(--floraa-elements-messages-linkColor)',
            code: {
              background: 'var(--floraa-elements-messages-code-background)',
            },
            inlineCode: {
              background: 'var(--floraa-elements-messages-inlineCode-background)',
              text: 'var(--floraa-elements-messages-inlineCode-text)',
            },
          },
          icon: {
            success: 'var(--floraa-elements-icon-success)',
            error: 'var(--floraa-elements-icon-error)',
            primary: 'var(--floraa-elements-icon-primary)',
            secondary: 'var(--floraa-elements-icon-secondary)',
            tertiary: 'var(--floraa-elements-icon-tertiary)',
          },
          preview: {
            addressBar: {
              background: 'var(--floraa-elements-preview-addressBar-background)',
              backgroundHover: 'var(--floraa-elements-preview-addressBar-backgroundHover)',
              backgroundActive: 'var(--floraa-elements-preview-addressBar-backgroundActive)',
              text: 'var(--floraa-elements-preview-addressBar-text)',
              textActive: 'var(--floraa-elements-preview-addressBar-textActive)',
            },
          },
          terminals: {
            background: 'var(--floraa-elements-terminals-background)',
            buttonBackground: 'var(--floraa-elements-terminals-buttonBackground)',
          },
          dividerColor: 'var(--floraa-elements-dividerColor)',
          loader: {
            background: 'var(--floraa-elements-loader-background)',
            progress: 'var(--floraa-elements-loader-progress)',
          },
          prompt: {
            background: 'var(--floraa-elements-prompt-background)',
          },
          sidebar: {
            dropdownShadow: 'var(--floraa-elements-sidebar-dropdownShadow)',
            buttonBackgroundDefault: 'var(--floraa-elements-sidebar-buttonBackgroundDefault)',
            buttonBackgroundHover: 'var(--floraa-elements-sidebar-buttonBackgroundHover)',
            buttonText: 'var(--floraa-elements-sidebar-buttonText)',
          },
          cta: {
            background: 'var(--floraa-elements-cta-background)',
            text: 'var(--floraa-elements-cta-text)',
          },
        },
      },
    },
  },
  transformers: [transformerDirectives()],
  presets: [
    presetUno({
      dark: {
        light: '[data-theme="light"]',
        dark: '[data-theme="dark"]',
      },
    }),
    presetIcons({
      warn: true,
      collections: {
        ...customIconCollection,
      },
    }),
  ],
});

/**
 * Generates an alpha palette for a given hex color.
 *
 * @param hex - The hex color code (without alpha) to generate the palette from.
 * @returns An object where keys are opacity percentages and values are hex colors with alpha.
 *
 * Example:
 *
 * ```
 * {
 *   '1': '#FFFFFF03',
 *   '2': '#FFFFFF05',
 *   '3': '#FFFFFF08',
 * }
 * ```
 */
function generateAlphaPalette(hex: string) {
  return [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reduce(
    (acc, opacity) => {
      const alpha = Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, '0');

      acc[opacity] = `${hex}${alpha}`;

      return acc;
    },
    {} as Record<number, string>,
  );
}
