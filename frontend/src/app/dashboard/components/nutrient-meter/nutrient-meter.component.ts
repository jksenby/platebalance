import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

/** Шкала «съедено из нормы» для одного нутриента. При превышении нормы заливка краснеет. */
@Component({
  selector: 'app-nutrient-meter',
  imports: [ProgressBarModule],
  template: `
    <div class="header">
      <span class="label">{{ label() }}</span>
      <span class="value">
        {{ consumed().toLocaleString('ru-RU') }}
        <span class="muted">/ {{ target().toLocaleString('ru-RU') }} {{ unit() }}</span>
      </span>
    </div>
    <p-progressbar
      class="bar"
      [value]="percent()"
      [showValue]="false"
      [color]="over() ? 'var(--p-red-500)' : undefined"
    />
  `,
  styles: `
    :host {
      display: block;

      .header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.375rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .label {
        font-weight: 500;
      }

      .value {
        font-variant-numeric: tabular-nums;
      }

      .bar {
        --p-progressbar-height: 0.5rem;
      }
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
