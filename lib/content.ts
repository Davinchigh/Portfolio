export const services = [
  {
    id: "landscape",
    title: "Landscape design & installation",
    line: "Paths, beds, water features and shade, planned around how you actually live outside.",
    image: "/img/landscape-sm.webp",
    alt: "A home garden with pale stepping stones through lawn, beds of lavender, croton and heliconia, and a stone water bowl",
  },
  {
    id: "lawn",
    title: "Lawn care & maintenance",
    line: "Mowing, edging, feeding and weed control on a schedule, so the grass stays thick all year.",
    image: "/img/lawn-sm.webp",
    alt: "A freshly striped lawn meeting a clean border of marigolds and ferns, with a sprinkler in the morning sun",
  },
  {
    id: "planting",
    title: "Garden design & planting",
    line: "Flower beds, kitchen gardens and pots, chosen for your light, your soil and our climate.",
    image: "/img/planting-sm.webp",
    alt: "Hands pressing soil around a young tomato plant in a raised bed beside basil, lettuce and peppers",
  },
]

export const extras = ["Irrigation", "Tree & shrub care", "Organic gardening", "Seasonal clean-ups", "Mulching", "Pots & balconies"]

export const steps = [
  { n: "01", title: "We visit", body: "A free 45 minute walk round your space. We look at light, soil and drainage, and listen to what you want from it." },
  { n: "02", title: "We plan", body: "Within a week you get a simple plan with plants, costs and a timeline. Nothing starts until you say yes." },
  { n: "03", title: "It grows", body: "We plant, then keep it thriving with visits that fit your budget. You get the joy, we get our hands dirty." },
]

export const values = [
  { title: "Expertise", body: "Trained gardeners who know what grows here." },
  { title: "Made for you", body: "No templates. Every garden starts from your space." },
  { title: "Sustainable", body: "Compost, mulch and smart watering by default." },
  { title: "Fair prices", body: "Clear quotes, no surprises at the end." },
]

/** A rough monthly guide for southern Ghana: dry season Dec to Mar, major rains Apr to Jul, minor rains Sep to Nov. */
export const months = [
  { m: "Jan", season: "Dry season, harmattan", plant: ["Aloe and succulents", "Bougainvillea", "Seedlings in shaded trays"], care: "Water deeply in the early morning and mulch everything to hold moisture." },
  { m: "Feb", season: "Dry season", plant: ["Herbs in pots: basil, mint", "Snake plants and ZZ for indoors"], care: "Raise the mower height so the lawn shades its own roots." },
  { m: "Mar", season: "Before the rains", plant: ["Start tomato and pepper seedlings", "Prepare beds with compost"], care: "Prune shrubs and hedges now, before the growth spurt." },
  { m: "Apr", season: "Major rains begin", plant: ["Transplant tomatoes, peppers, garden eggs", "New lawns from grass runners"], care: "Check drainage after the first big storms." },
  { m: "May", season: "Major rains", plant: ["Trees and hedges", "Okra and leafy greens", "Flowering shrubs"], care: "Weed little and often while the soil is soft." },
  { m: "Jun", season: "Peak rains", plant: ["Ground covers on bare slopes", "Banana and plantain suckers"], care: "Stake tall plants before the wind does it for you." },
  { m: "Jul", season: "Rains easing", plant: ["Second sowing of greens", "Ornamental grasses"], care: "Feed the lawn while there's still rain to wash it in." },
  { m: "Aug", season: "The little dry", plant: ["Herbs and pot plants", "Drought-tolerant borders"], care: "Mulch beds again and water new plantings every second day." },
  { m: "Sep", season: "Minor rains begin", plant: ["Marigolds, zinnias, periwinkle", "Second vegetable crop"], care: "Top up compost before you plant." },
  { m: "Oct", season: "Minor rains", plant: ["New lawns and patches", "Climbers on fences"], care: "Aerate tired lawns so the rain gets in." },
  { m: "Nov", season: "Rains ending", plant: ["Last transplants before the dry", "Shade trees"], care: "Set up drip lines or a watering routine for the dry months." },
  { m: "Dec", season: "Dry season returns", plant: ["Festive pots: poinsettia, crotons", "Succulent gardens"], care: "Clear fallen leaves into the compost and rest the beds." },
]
