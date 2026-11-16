import { shallowMount } from "@vue/test-utils";

import StatsDB from "@/components/Static/Statistics/StatsDB.vue";
import StatsPolicy from "@/components/Static/Statistics/StatsPolicy.vue";
import StatsStandard from "@/components/Static/Statistics/StatsStandard.vue";

const chart = { labels: ["A"], datasets: [{ data: [1] }] };

const chartStubs = {
  BarChart: {
    name: "BarChart",
    props: ["refName", "fieldsChart", "showPercent"],
    template: "<div class=\"bar-chart\" />",
  },
  PieChart: {
    name: "PieChart",
    props: ["refName", "fieldsChart", "linkWork"],
    template: "<div class=\"pie-chart\" />",
  },
};

const mountStats = (component, props = {}) =>
  shallowMount(component, {
    props,
    global: {
      stubs: chartStubs,
    },
  });

describe("Static statistics chart groups", () => {
  it("does not render chart components when optional chart props are absent", () => {
    const wrapper = mountStats(StatsDB);

    expect(wrapper.findAllComponents({ name: "BarChart" })).toHaveLength(0);
    expect(wrapper.findAllComponents({ name: "PieChart" })).toHaveLength(0);
  });

  it("renders all database chart sections with the expected chart props", () => {
    const wrapper = mountStats(StatsDB, {
      chartSubjects: chart,
      chartCountries: chart,
      chartSpecies: chart,
      chartImplements: chart,
      chartLinks: chart,
      chartJournals: chart,
      chartLicences: chart,
      chartFunders: chart,
      chartNonFunders: chart,
      chartMaintainers: chart,
      chartPublication: chart,
    });

    const barCharts = wrapper.findAllComponents({ name: "BarChart" });
    const pieCharts = wrapper.findAllComponents({ name: "PieChart" });

    expect(barCharts).toHaveLength(8);
    expect(pieCharts).toHaveLength(3);
    expect(barCharts.map((bar) => bar.props("refName"))).toContain(
      "barJourDB2",
    );
    expect(
      barCharts.find((bar) => bar.props("refName") === "barJourDB2").props(
        "showPercent",
      ),
    ).toBe(false);
    expect(pieCharts[0].props("linkWork")).toBe(false);
  });

  it("renders all standard chart sections with standard-specific ref names", () => {
    const wrapper = mountStats(StatsStandard, {
      chartSubjects: chart,
      chartCountries: chart,
      chartSpecies: chart,
      chartImplements: chart,
      chartLinks: chart,
      chartJournals: chart,
      chartLicences: chart,
      chartFunders: chart,
      chartNonFunders: chart,
      chartMaintainers: chart,
      chartPublication: chart,
    });

    expect(wrapper.findAllComponents({ name: "BarChart" })).toHaveLength(8);
    expect(wrapper.findAllComponents({ name: "PieChart" })).toHaveLength(3);
    expect(
      wrapper
        .findAllComponents({ name: "BarChart" })
        .map((bar) => bar.props("refName")),
    ).toContain("barSubjectsStand2");
  });

  it("renders all policy chart sections and leaves omitted sections hidden", () => {
    const wrapper = mountStats(StatsPolicy, {
      chartSubjects: chart,
      chartCountries: chart,
      chartSpecies: chart,
      chartLinks: chart,
      chartFunders: chart,
      chartNonFunders: chart,
      chartMaintainers: chart,
    });

    expect(wrapper.findAllComponents({ name: "BarChart" })).toHaveLength(5);
    expect(wrapper.findAllComponents({ name: "PieChart" })).toHaveLength(2);
    expect(
      wrapper
        .findAllComponents({ name: "BarChart" })
        .map((bar) => bar.props("refName")),
    ).toEqual([
      "barSubjectsPol2",
      "barCountriesPol2",
      "barSpeciesPol2",
      "barFundersPol2",
      "barNonFundersPol2",
    ]);
  });
});
