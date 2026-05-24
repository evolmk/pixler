# Motion Rules

**When to read:
** When building any page or component. Function over flair — motion communicates state change, never decoration.

## Core rule

**200ms ease for all transitions.** Apply via
`transition-all duration-200 ease` to: hover states, scroll-state headers, dropdown open/close, any visual state change.

## Allowed motion

| Pattern                | Implementation                                                                |
|------------------------|-------------------------------------------------------------------------------|
| Header scroll collapse | White → White (blurred bg), 70px → 50px, `duration-200 ease`                  |
| Dropdown open/close    | Fade in/out with opacity, `duration-200 ease`                                 |
| Skeleton → content     | `<Skeleton>` with `animate-pulse`, swap on load                               |
| Toast slide-in         | Radix Toast — slides from bottom-right                                        |
| Card entrance          | `animate-in fade-in slide-in-from-bottom-2 duration-300` with staggered delay |
| Collapsible sections   | Radix `Collapsible` with `duration-200 ease-out`                              |
| Tab switch             | `animate-in fade-in duration-150`                                             |

## Forbidden

No springs/bounces, parallax, on-scroll reveals (except header collapse), floating/looping elements, or decorative animation.

## Reduced motion

Wrap motion in `motion-safe:` prefix: `class="motion-safe:transition-all motion-safe:duration-200"`.
