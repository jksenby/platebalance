import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Шкала «съедено из нормы» для одного нутриента. При превышении нормы заливка краснеет. */
@Component({
  selector: 'app-nutrient-meter',
  template: `
    <div class="meter__header">
      <span class="meter__label">{{ label() }}</span>
      <span class="meter__value">
        {{ consumed().toLocaleString('ru-RU') }}
        <span class="muted">/ {{ target().toLocaleString('ru-RU') }} {{ unit() }}</span>
      </span>
    </div>
    <div
      class="meter__track"
      role="meter"
      [attr.aria-label]="label()"
      [attr.aria-valuenow]="consumed()"
      aria-valuemin="0"
      [attr.aria-valuemax]="target()"
      [attr.aria-valuetext]="consumed() + ' из ' + target() + ' ' + unit()"
    >
      <div class="meter__fill" [class.meter__fill--over]="over()" [style.width.%]="percent()"></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .meter__header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.375rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    .meter__label {
      font-weight: 500;
    }

    .meter__value {
      font-variant-numeric: tabular-nums;
    }

    .meter__track {
      height: 0.5rem;
      overflow: hidden;
      border-radius: 9999px;
      background-color: var(--pb-accent-soft);
    }

    .meter__fill {
      height: 100%;
      border-radius: 9999px;
      background-color: var(--pb-accent);
      transition: width 0.3s ease;
    }

    .meter__fill--over {
      background-color: var(--pb-danger);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NutrientMeterComponent {
  readonly label = input.required<string>();
  readonly consumed = input.required<number>();
  readonly target = input.required<number>();
  readonly unit = input('г');

  protected readonly over = computed(() => this.consumed() > this.target());
  protected readonly percent = computed(() =>
    this.target() > 0 ? Math.min(100, (this.consumed() / this.target()) * 100) : 0,
  );
}
