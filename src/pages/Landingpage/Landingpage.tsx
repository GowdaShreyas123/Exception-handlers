"use client";

import { Button } from "@/components/ui/shadcn/src/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/src/card";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticlesBackground from "./BrainAtlasAnimation";
import { useNavigate } from "react-router-dom";
import BrainMeshBackground from "@/layout/SoftBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const staggerParent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

const objectiveCard = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const Landingpage = () => {
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 100]);
  const y2 = useTransform(scrollY, [0, 600], [0, -140]);

  const objectives = [
    {
      number: "01",
      title: "Graph Alignment Investigation",
      description:
        "To investigate existing graph alignment techniques and adapt them to align brain atlases represented as graphs with varying spatial resolutions.",
      icon: "🔬",
    },
    {
      number: "02",
      title: "Pseudo Atlas Framework",
      description:
        "To develop a framework for integrating aligned graphs from multiple atlases into a unified Pseudo Atlas representation for classification tasks.",
      icon: "🧠",
    },
    {
      number: "03",
      title: "GNN Model Exploration",
      description:
        "To explore the use of graph neural network (GNN) models to learn representations of brain connectivity patterns and classify depressed and non-depressed patients using fMRI data based on the Pseudo Atlas.",
      icon: "🤖",
    },
    {
      number: "04",
      title: "Performance Evaluation",
      description:
        "To evaluate the proposed approach on a dataset of fMRI scans from depressed and non-depressed individuals, comparing its performance with existing methods for classification tasks.",
      icon: "📊",
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative flex flex-col items-center justify-center min-h-[100vh] px-4 py-20 text-center">
        <ParticlesBackground />
     
        {/* Floating Parallax Background Orbs */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl pointer-events-none"
        />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 bg-info-400/10 blur-3xl rounded-full pointer-events-none"></div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerParent}
          className="relative z-10 max-w-5xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-8 py-6 rounded-full bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700">
              <span className="text-lg font-semibold text-brandText-primary">
                fMRI Research Project
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-h1 font-bold text-brandText-primary leading-tight"
          >
            Integrating Multi-Atlas Graph Alignment
            <span className="block mt-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              (Pseudo Atlas Graphs)
            </span>
            <span className="block mt-2 text-3xl md:text-4xl lg:text-5xl">
              for Classification of Depressed Patients
            </span>
            <span className="block mt-2 text-2xl md:text-3xl lg:text-4xl text-brandText-secondary">
              Using fMRI Data
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl  max-w-3xl mx-auto "
          >
            Advancing depression diagnosis through innovative graph neural
            network approaches and multi-atlas brain connectivity analysis
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="gradient"
                className="flex items-center gap-2"
                onClick={() => navigate("/brainimagining")} // <-- your route here
              >
                Want to know more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-white"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      {/* ---------------- ABSTRACT SECTION ---------------- */}
      <section className="relative py-20 px-4 bg-lilac-bg">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Card className="border-2 border-primary-200 dark:border-primary-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <CardTitle className="text-h3 text-brandText-primary">
                    Abstract
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base md:text-lg text-brandText-secondary leading-relaxed">
                  The accurate classification of depressed and non-depressed
                  patients using functional magnetic resonance imaging (fMRI)
                  data presents a significant challenge due to the heterogeneous
                  nature of brain connectivity patterns. This research proposes
                  a novel approach that leverages graph alignment techniques to
                  integrate information from multiple brain atlases into a
                  unified representation called a{" "}
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    "Pseudo Atlas."
                  </span>{" "}
                  This Pseudo Atlas aims to capture structural and functional
                  connectivity patterns across different atlases to facilitate
                  classification of depressed and non-depressed patients.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
  
      {/* ---------------- OBJECTIVES SECTION ---------------- */}
      <section className="relative py-20 px-4 bg-background-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-h2 font-bold text-brandText-primary mb-4"
            >
              Project Objectives
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-lg text-brandText-secondary max-w-2xl mx-auto"
            >
              Our research focuses on four key objectives to advance depression
              diagnosis
            </motion.p>
          </div>

          {/* Objective Cards */}
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {objectives.map((objective, index) => (
              <motion.div key={index} variants={objectiveCard}>
                <Card className="group relative overflow-hidden border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 dark:from-primary-900/10 dark:to-secondary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl font-bold text-primary-200 dark:text-primary-800">
                        {objective.number}
                      </div>
                      <div className="text-4xl">{objective.icon}</div>
                    </div>
                    <CardTitle className="text-h4 text-brandText-primary mb-2">
                      {objective.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <p className="text-base text-brandText-secondary leading-relaxed">
                      {objective.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ---------------- SIGNIFICANCE SECTION ---------------- */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary-50 via-secondary-50 to-info-50 dark:from-primary-900/20 dark:via-secondary-900/20 dark:to-info-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Card className="border-2 border-secondary-200 dark:border-secondary-800 shadow-xl bg-background-section">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary-500 to-info-500 flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                  <CardTitle className="text-h3 text-brandText-primary">
                    Research Significance
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-base md:text-lg text-brandText-secondary leading-relaxed">
                  This research introduces the concept of a{" "}
                  <span className="font-semibold text-secondary-600 dark:text-secondary-400">
                    Pseudo Atlas
                  </span>
                  , which integrates information from multiple brain atlases
                  into a unified representation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="p-6 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                    <h3 className="text-h5 font-semibold text-brandText-primary mb-2 flex items-center gap-2">
                      <span>🔍</span> Enhanced Interpretability
                    </h3>
                    <p className="text-sm text-brandText-secondary">
                      By capturing complex patterns across different graphs, the
                      approach improves interpretability of fMRI classification
                      models.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800">
                    <h3 className="text-h5 font-semibold text-brandText-primary mb-2 flex items-center gap-2">
                      <span>🎯</span> Accurate Diagnostics
                    </h3>
                    <p className="text-sm text-brandText-secondary">
                      The Pseudo Atlas enables more accurate and robust methods
                      for diagnosing depression.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      {/* ---------------- FOOTER CTA ---------------- */}
      <section className="relative py-16 px-4 bg-background-app">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-h3 font-bold text-brandText-primary"
          >
            Ready to Explore Our Research?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-lg text-brandText-secondary"
          >
            Discover how multi-atlas graph alignment is revolutionizing
            depression diagnosis
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="gradient"
                size="lg"
                className="px-8 py-6 text-lg"
                onClick={() => navigate("/brainimagining")} // <-- your route here
              >
                Get Started
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="lg"
                className="px-8 py-6 text-lg"
                onClick={() => alert("Feature coming soon!")} // <--- Added this
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landingpage;
