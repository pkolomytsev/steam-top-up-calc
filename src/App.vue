<template>
  <v-container>
    <v-card variant="outlined" :loading="rates.loading" class="my-3">
      <template #title>
        Exchange Rates
        <v-icon
          size="20"
          icon="mdi-sync"
          class="mt-n1"
          @click="refreshRates"
        />
      </template>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              v-model.number="rates.steam"
              label="RUB/USD (Steam)"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="rates.wmz"
              label="RUB/WMZ"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card title="Web Money" variant="outlined" class="my-3">
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              v-model.number="commissions.service"
              label="Service Fee (%)"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="commissions.payment"
              label="Payment Commission (%)"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-n7">
          <v-col class="ml-2">
            <p class="font-weight-light">
              WMZ: {{ ceil(wmzTotal) }} (Base: {{ ceil(topUpUsd) }}; Service
              Fee: {{ ceil(wmzServiceFee) }}; Payment Commission:
              {{ ceil(wmzPaymentCommission) }})
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card title="Top-up" variant="outlined" class="my-3">
      <v-container>
        <v-row>
          <v-col>
            <v-select
              v-model="topUp.currency"
              label="Currency"
              :items="currencies"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              v-model.number="topUp.amount"
              :label="topUp.currency"
              variant="outlined"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="topUp.currency != Currency.usd" class="mt-n7">
          <v-col class="ml-2">
            <p class="font-weight-light">USD: {{ ceil(topUpUsd) }}</p>
          </v-col>
        </v-row>
        <v-divider class="border-opacity-25 mt-3 mb-7"></v-divider>
        <v-row>
          <v-col>
            <v-text-field
              v-model.number="commissions.trader"
              label="Trader Commission (%)"
              variant="outlined"
            >
            </v-text-field>
          </v-col>
          <v-col class="trading-details mt-n1">
            <p class="font-weight-light">Income: {{ ceil(tradingIncome) }}</p>
            <p class="font-weight-light">
              Expense: {{ ceil(tradingExpense) }}
            </p>
            <p class="font-weight-light">
              Profit: {{ ceil(tradingProfit) }} ({{
                ceil(tradingProfitRate)
              }}%)
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, computed, reactive } from "vue";

import { fetchSteamRate } from "./steam";

enum Currency {
  rub = "RUB",
  usd = "USD",
}
const currencies = Object.values(Currency);

const rates = reactive({
  steam: 100,
  wmz: 85,
  loading: false,
});
const commissions = reactive({
  service: 18,
  payment: 1,
  trader: 5,
});
const topUp = reactive({
  currency: Currency.rub,
  amount: 1000,
});

const topUpUsd = computed(() => {
  if (topUp.currency == Currency.usd) {
    return topUp.amount;
  }
  return topUp.amount / (rates.steam ? rates.steam : 1);
});
const wmzServiceFee = computed(() => {
  return (topUpUsd.value * commissions.service) / 100;
});
const wmzPaymentCommission = computed(() => {
  return (topUpUsd.value * commissions.payment) / 100;
});
const wmzTotal = computed(() => {
  return topUpUsd.value + wmzPaymentCommission.value + wmzServiceFee.value;
});
const tradingIncome = computed(() => {
  return topUpUsd.value * rates.steam * (1 + commissions.trader / 100);
});
const tradingExpense = computed(() => {
  return wmzTotal.value * rates.wmz;
});
const tradingProfit = computed(() => {
  return tradingIncome.value - tradingExpense.value;
});
const tradingProfitRate = computed(() => {
  return (tradingProfit.value / tradingExpense.value) * 100;
});

onBeforeMount(async () => {
  if (import.meta.env.DEV) {
    return;
  }
  await refreshRates();
});

async function refreshRates() {
  if (rates.loading) {
    return;
  }
  rates.loading = true;
  try {
    await fetchExchangeRates();
  } catch (error) {
    console.log(error);
  }
  rates.loading = false;
}

async function fetchExchangeRates() {
  rates.steam = ceil(await fetchSteamRate());
  rates.wmz = ceil(await fetchWmzRate());
}

async function fetchWmzRate(): Promise<number> {
  // TODO: implement via WebMoney API
  return rates.steam * 0.85;
}

function ceil(value: number): number {
  return Math.ceil(value * 100) / 100;
}
</script>

<style scoped>
.trading-details {
  font-size: 0.9rem;
}
</style>
