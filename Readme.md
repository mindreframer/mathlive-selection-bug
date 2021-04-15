### Mathlive Selection Bug

Reproduction for a selection bug in Mathlive:

- reading selection ranges in "selection-changed" event and setting the same range back does result in a different selection

### Steps:

- Mark a selection in the input, so that you see `3^4+2^4-3 -->> from/to: ( 1 - 12, depth: 1 )` on top.
- Means: the selection range that mathlive returns, starts at 1 and ends at 12.
- Put values `1-12` into the input next to the "SELECT" button and press select
  - this will set the selection on mathlive to a range from 1 to 12
- suddenly the selection grows to 1-33: `3^4+2^4-3+{\frac{1}{2+({\frac{2}{3}})^2}} -->> from/to: ( 1 - 33, depth: 1 )`
