// Script to seed the database with the comprehensive curriculum data
import { supabase } from "../src/api/supabaseClient.js"

const curriculumData = {
  "Grade 10": {
    Mathematics: {
      "Algebraic Expressions": [
        "Understanding the Real Number System",
        "Rational and Irrational Numbers",
        "Rounding Off and Estimating Surds",
        "Products and Factorisation",
        "Simplifying Algebraic Fractions",
      ],
      "Equations and Inequalities": [
        "Solving Linear Equations",
        "Solving Quadratic Equations",
        "Solving Inequalities",
        "Word Problems Involving Equations",
      ],
      "Functions and Graphs": [
        "Introduction to Functions",
        "Linear Functions",
        "Quadratic Functions",
        "Hyperbolic and Exponential Functions",
      ],
      "Number Patterns": ["Identifying Patterns", "Arithmetic Sequences", "Geometric Sequences"],
      Finance: ["Simple Interest", "Compound Interest"],
      Geometry: ["Basic Geometric Figures", "Properties of Triangles and Quadrilaterals", "Circles and Angles"],
      Trigonometry: ["Introduction to Trigonometric Ratios", "Solving Right-Angled Triangles", "Trigonometric Graphs"],
      Statistics: ["Collecting and Organizing Data", "Measures of Central Tendency", "Representing Data Graphically"],
    },
    "Physical Sciences": {
      "Skills for Science": ["Scientific Method and Laboratory Safety", "Measurement and Units"],
      "Classification of Matter": ["States of Matter", "Elements, Compounds, and Mixtures"],
      "Atomic Structure": ["Structure of the Atom", "Periodic Table and Electron Configuration"],
      "Chemical Bonding": ["Ionic and Covalent Bonds", "Metallic Bonding"],
      "Chemical Reactions": ["Types of Chemical Reactions", "Balancing Chemical Equations"],
      Mechanics: ["Motion in One Dimension", "Newton's Laws of Motion"],
      "Waves, Sound, and Light": ["Properties of Waves", "Sound Waves", "Light and Optics"],
    },
    "Life Sciences": {
      "The Chemistry of Life": ["Introduction to Biochemistry", "Carbohydrates, Proteins, and Lipids"],
      "Cells: The Basic Units of Life": ["Cell Structure and Function", "Cell Membrane and Transport"],
      "Cell Division: Mitosis": ["Phases of Mitosis", "Importance of Cell Division"],
      "Plant and Animal Tissues": ["Types of Plant Tissues", "Types of Animal Tissues"],
      "Biodiversity and Classification": ["Importance of Biodiversity", "Classification Systems"],
      Ecology: ["Ecosystems and Biomes", "Energy Flow and Nutrient Cycles"],
    },
  },
  "Grade 11": {
    Mathematics: {
      "Algebraic Expressions and Equations": [
        "Exponents and Surds",
        "Solving Quadratic Equations",
        "Simultaneous Equations",
      ],
      "Functions and Graphs": ["Understanding Functions", "Graphs of Functions", "Transformations of Graphs"],
      "Number Patterns": ["Arithmetic Sequences", "Geometric Sequences"],
      Finance: ["Simple and Compound Interest", "Depreciation and Inflation"],
      Trigonometry: ["Trigonometric Identities", "Solving Trigonometric Equations", "Applications of Trigonometry"],
      "Analytical Geometry": ["Distance and Midpoint Formulae", "Gradient and Equation of a Line"],
      Statistics: ["Measures of Dispersion", "Representing Data"],
    },
    "Physical Sciences": {
      Mechanics: ["Vectors and Scalars", "Newton's Laws of Motion"],
      "Waves and Sound": ["Properties of Waves", "Sound Waves"],
      "Electricity and Magnetism": ["Electrostatics", "Electric Circuits"],
      "Chemical Bonding": ["Molecular Shapes", "Intermolecular Forces"],
      "Chemical Reactions": ["Energy Changes in Reactions", "Rates of Reaction"],
    },
    "Life Sciences": {
      "Biodiversity of Microorganisms": ["Viruses, Bacteria, and Protists"],
      "Biodiversity of Plants": ["Bryophytes, Pteridophytes, Gymnosperms, and Angiosperms"],
      "Biodiversity of Animals": ["Invertebrates and Vertebrates"],
      "Human Impact on the Environment": ["Pollution and Conservation"],
      "Photosynthesis and Respiration": ["Process of Photosynthesis", "Cellular Respiration"],
    },
  },
  "Grade 12": {
    Mathematics: {
      "Sequences and Series": ["Arithmetic and Geometric Sequences", "Series and Sigma Notation"],
      "Functions and Graphs": ["Exponential and Logarithmic Functions", "Inverses of Functions"],
      Finance: ["Annuities and Present Value", "Loan Repayments"],
      Trigonometry: ["Compound and Double Angle Identities", "Solving Trigonometric Equations"],
      "Analytical Geometry": ["Circles and Tangents", "Angle Between Lines"],
      Calculus: ["Introduction to Derivatives", "Applications of Derivatives"],
      Probability: ["Counting Principles", "Probability Rules"],
    },
    "Physical Sciences": {
      Mechanics: ["Momentum and Impulse", "Work, Energy, and Power"],
      Electrodynamics: ["Electric Circuits", "Electromagnetic Induction"],
      "Chemical Equilibrium": ["Dynamic Equilibrium", "Le Chatelier's Principle"],
      "Acids and Bases": ["pH and pOH Calculations", "Acid-Base Reactions"],
      "Organic Chemistry": ["Hydrocarbons", "Functional Groups and Reactions"],
    },
    "Life Sciences": {
      "DNA: Code of Life": ["Structure and Function of DNA", "Protein Synthesis"],
      Meiosis: ["Phases of Meiosis", "Genetic Variation"],
      "Human Reproduction": ["Male and Female Reproductive Systems", "Fertilization and Development"],
      "Genetics and Inheritance": ["Mendelian Genetics", "Genetic Disorders"],
      Evolution: ["Theories of Evolution", "Evidence for Evolution"],
    },
  },
}

async function seedCurriculum() {
  console.log("🌱 Starting curriculum seeding...")

  try {
    // Process each grade
    for (const [gradeName, subjects] of Object.entries(curriculumData)) {
      console.log(`📚 Processing ${gradeName}...`)

      // Create or get grade
      let { data: grade, error: gradeError } = await supabase.from("grades").select("id").eq("name", gradeName).single()

      if (gradeError && gradeError.code === "PGRST116") {
        // Grade doesn't exist, create it
        const { data: newGrade, error: createGradeError } = await supabase
          .from("grades")
          .insert([
            {
              name: gradeName,
              description: `Curriculum for ${gradeName} students`,
            },
          ])
          .select("id")
          .single()

        if (createGradeError) {
          console.error(`❌ Error creating grade ${gradeName}:`, createGradeError)
          continue
        }
        grade = newGrade
        console.log(`✅ Created grade: ${gradeName}`)
      }

      // Process each subject
      for (const [subjectName, topics] of Object.entries(subjects)) {
        console.log(`  📖 Processing subject: ${subjectName}`)

        // Create or get subject
        let { data: subject, error: subjectError } = await supabase
          .from("subjects")
          .select("id")
          .eq("name", subjectName)
          .eq("grade_id", grade.id)
          .single()

        if (subjectError && subjectError.code === "PGRST116") {
          // Subject doesn't exist, create it
          const { data: newSubject, error: createSubjectError } = await supabase
            .from("subjects")
            .insert([
              {
                name: subjectName,
                description: `${subjectName} curriculum for ${gradeName}`,
                grade_id: grade.id,
              },
            ])
            .select("id")
            .single()

          if (createSubjectError) {
            console.error(`❌ Error creating subject ${subjectName}:`, createSubjectError)
            continue
          }
          subject = newSubject
          console.log(`    ✅ Created subject: ${subjectName}`)
        }

        // Process each topic
        for (const [topicName, videos] of Object.entries(topics)) {
          console.log(`    📝 Processing topic: ${topicName}`)

          // Create or get topic
          let { data: topic, error: topicError } = await supabase
            .from("topics")
            .select("id")
            .eq("name", topicName)
            .eq("subject_id", subject.id)
            .single()

          if (topicError && topicError.code === "PGRST116") {
            // Topic doesn't exist, create it
            const { data: newTopic, error: createTopicError } = await supabase
              .from("topics")
              .insert([
                {
                  name: topicName,
                  description: `${topicName} - ${subjectName} topic for ${gradeName}`,
                  subject_id: subject.id,
                },
              ])
              .select("id")
              .single()

            if (createTopicError) {
              console.error(`❌ Error creating topic ${topicName}:`, createTopicError)
              continue
            }
            topic = newTopic
            console.log(`      ✅ Created topic: ${topicName}`)
          }

          // Process each video
          for (let i = 0; i < videos.length; i++) {
            const videoTitle = videos[i]
            console.log(`      🎥 Processing video: ${videoTitle}`)

            // Check if video already exists
            const { data: existingVideo } = await supabase
              .from("videos")
              .select("id")
              .eq("title", videoTitle)
              .eq("topic_id", topic.id)
              .single()

            if (!existingVideo) {
              // Create video entry
              const { error: videoError } = await supabase.from("videos").insert([
                {
                  title: videoTitle,
                  description: `Educational video covering ${videoTitle} in ${topicName}`,
                  url: `/placeholder-videos/${gradeName.toLowerCase().replace(" ", "-")}/${subjectName.toLowerCase().replace(/\s+/g, "-")}/${topicName.toLowerCase().replace(/\s+/g, "-")}/video-${i + 1}.mp4`,
                  topic_id: topic.id,
                },
              ])

              if (videoError) {
                console.error(`❌ Error creating video ${videoTitle}:`, videoError)
              } else {
                console.log(`        ✅ Created video: ${videoTitle}`)
              }
            }
          }
        }
      }
    }

    console.log("🎉 Curriculum seeding completed successfully!")

    // Print summary
    const { data: gradesCount } = await supabase.from("grades").select("id", { count: "exact" })
    const { data: subjectsCount } = await supabase.from("subjects").select("id", { count: "exact" })
    const { data: topicsCount } = await supabase.from("topics").select("id", { count: "exact" })
    const { data: videosCount } = await supabase.from("videos").select("id", { count: "exact" })

    console.log("\n📊 Database Summary:")
    console.log(`   Grades: ${gradesCount?.length || 0}`)
    console.log(`   Subjects: ${subjectsCount?.length || 0}`)
    console.log(`   Topics: ${topicsCount?.length || 0}`)
    console.log(`   Videos: ${videosCount?.length || 0}`)
  } catch (error) {
    console.error("💥 Error during seeding:", error)
  }
}

// Run the seeding function
seedCurriculum()
