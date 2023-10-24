import { TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { Component, inject } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

describe('AppComponent', () => {
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    {
                        path: 'alpha',
                        component: AlphaComponent,
                    },
                    {
                        path: 'beta',
                        component: BetaComponent,
                        canActivate: [() => inject(Router).parseUrl('/gamma')],
                    },
                    {
                        path: 'gamma',
                        component: GammaComponent,
                    },
                    {
                        path: 'delta',
                        component: DeltaComponent,
                        canActivate: [() => false],
                    },
                ]),
                provideLocationMocks(),
            ],
        });

        harness = await RouterTestingHarness.create();
    });

    describe('navigation allowed', () => {
        it('without expected component.', async () => {
            expect(await harness.navigateByUrl('/alpha')).toBeInstanceOf(
                AlphaComponent
            );
        });

        it('with expected component.', async () => {
            expect(
                await harness.navigateByUrl('/alpha', AlphaComponent)
            ).toBeInstanceOf(AlphaComponent);
        });
    });

    describe('redirection to different component', () => {
        it(`without expected component.`, async () => {
            expect(await harness.navigateByUrl('/beta')).toBeInstanceOf(
                GammaComponent
            );
        });

        it(`with correct expected component.`, async () => {
            expect(
                await harness.navigateByUrl('/beta', GammaComponent)
            ).toBeInstanceOf(GammaComponent);
        });

        it(`with incorrect expected component.`, async () => {
            await expectAsync(
                harness.navigateByUrl('/beta', BetaComponent)
            ).toBeRejectedWithError();
        });
    });

    describe('navigation rejected', () => {
        it(`without expected component.`, async () => {
            expect(await harness.navigateByUrl('/delta')).toBeNull();
        });

        it(`with incorrect expected component.`, async () => {
            await expectAsync(
                harness.navigateByUrl('/delta', DeltaComponent)
            ).toBeRejectedWithError();
        });
    });
});

@Component({ template: '', standalone: true })
class AlphaComponent {}

@Component({ template: '', standalone: true })
class BetaComponent {}

@Component({ template: '', standalone: true })
class GammaComponent {}

@Component({ template: '', standalone: true })
class DeltaComponent {}
