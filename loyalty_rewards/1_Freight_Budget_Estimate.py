import pandas as pd

df_order_details = pd.read_csv("order_details.csv")
df_orders = pd.read_csv("orders.csv")
category = pd.read_json("pc.json")

# Budget estimate for August 2021 month based on existing July 2021 month data

# step 1. Find existing July month freight cost

total_freight = df_orders["freight"]

# step 2. Evaluate 3 methods for splitting freight cost per unit to calculate impact of sales growth on
# overall freight cost.

#   method 1: Freight cost per unit per item split over total freight cost
#   method 2: Freight cost per unit for each country
#   method 3: Freight cost per unit for each order

# Chosen to adopt method 2 for freight cost per unit calculation.  As the company intends to focus on its top 6
# countries and loyal customers in the August 2021 month, grouping freight cost per unit for each country allows the
# estimated freight cost to reflect the additional cost of delivery in the country due to potential sales growth
# for the top 6 countries.

# Method 1: Freight cost per unit per item split over total freight cost

total_vol_sold = df_order_details["quantity"]

df_freight_per_vol_sold = sum(total_freight) / sum(total_vol_sold)

# method 2: Freight costs per unit for each country (this will be used for August freight budget calculation)

# a. group by order_id, extract total unit sold
df_qty_by_order_id = df_order_details.groupby(['order_id'])['quantity'].sum()

# b. set the data frame index using order_id, extract order_id, freight and ship_country information
df_freight_by_country = df_orders[['order_id', 'freight', 'ship_country']].set_index('order_id')

# c. combine orders and order_details to get total cost of freight per country
df_freight_ship_country = pd.concat([df_qty_by_order_id, df_freight_by_country], axis=1)

# d. With combined df, group by country to get combined freight per country
df_total_freight = df_freight_ship_country.groupby(['ship_country'])['freight'].sum()

# e. with combined df group by country to get combined unit sold
df_total_qty = df_freight_ship_country.groupby(['ship_country'])['quantity'].sum()

# f. calculate total freight cost per unit sold by country
df_freight_per_unit_country = df_total_freight / df_total_qty

# method 3: Freight costs per unit for each order

# (i). With combined df, group by order to get combined freight per order
df_total_freight_by_order = df_freight_ship_country.groupby(['order_id'])['freight'].sum()

# (ii). with combined df group by order to get combined qty
df_total_qty_by_order = df_freight_ship_country.groupby(['order_id'])['quantity'].sum()

#     (iii). calculate total freight cost by order
df_freight_per_unit_by_order = df_total_freight_by_order / df_total_qty_by_order

# step 3. sales growth

# Assume -  same product mix,
# Assume -  focus on top 6 target countries thereby projecting potential 10% sales growth and hence increase in
#           delivery of 10%
# Assume -  projecting potential 2% sales growth and hence increase delivery of 2% for the rest of the countries

# The top 6 countries based on analysis (see question 3) are:
# 1. Germany
# 2. USA
# 3. France
# 4. Brazil
# 5. UK
# 6. Austria

# 3 Calculate August freight cost

# 3 (a) Calculate August freight cost for top 6 countries

# total August 2021 freight costs for top 6 countries (projecting 10% increase in delivery due to 10% sales growth)
df_top6_freight = df_total_freight.loc[["Germany", "USA", "France", "Brazil", "UK", "Austria"]] * 1.1

# 3 (b) Calculate August freight for "not in top 6 countries" projecting 2% increase in delivery

df_not_in_top6_freight = df_total_freight.loc[df_total_freight.index.difference(
    ["Germany", "USA", "France", "Brazil", "UK", "Austria"])] * 1.02

# step 4. Assume Inflation of 5% per year (or 12 month). Inflation for August month = 0.42% (5% / 12)
df_inflation = (1 + (0.05 / 12))

# 5. Final budget

# August freight cost estimate
df_final_budget_with_inflation = (sum(df_top6_freight) + sum(df_not_in_top6_freight)) * df_inflation

# 6. Supplementary information for freight cost budget increment due to the following three components:

# 6 (a) increase in freight cost budget for top 6 countries (10% increase in delivery)

# 6 (a) (i) Find budget freight cost for top 6 countries (without projected growth)
df_top6_freight1 = df_total_freight.loc[["Germany", "USA", "France", "Brazil", "UK", "Austria"]]

# 6 (a) (ii) Estimated increase in freight cost for top 6 country due to 10% more delivery
#           (July vs August freight cost)
df_top6_freight_dif = sum(df_top6_freight) - sum(df_top6_freight1)

# 6 (b) increase in freight cost budget for "not in top 6 countries"

# 6 (b) (i) Find budget freight cost for "not in top 6 countries" (projecting no change in delivery and sales,
#           using July freight cost)
df_not_in_top6_freight1 = df_total_freight.loc[
    df_total_freight.index.difference(["Germany", "USA", "France", "Brazil", "UK", "Austria"])]

# 6 (b) (ii)  Budget freight cost increase for "not in top 6 countries" due to 10% more delivery
df_not_in_top6_freight_dif = sum(df_not_in_top6_freight) - sum(df_not_in_top6_freight1)

# 6 (c) Freight cost increase

# 6 (i）Freight cost budget projected without inflation for August
df_final_budget_with_out_inflation = (sum(df_top6_freight) + sum(df_not_in_top6_freight))

# 6 (ii) Freight cost increase allowing for inflation for August month
df_final_budget_with_inflation_diff = df_final_budget_with_inflation - df_final_budget_with_out_inflation

# Print outputs
print(f"The estimated freight cost budget for the month of August 2021 is AUD {df_final_budget_with_inflation:,.0f}.\n")

print(f"The estimated cost is derived from: \n "
      f"(i) July freight cost of AUD {(sum(total_freight)):,.0f} plus estimated increase in cost due to: \n "
      f"(ii) 10% estimated increase in delivery cost for top 6 countries of AUD {df_top6_freight_dif:,.0f}; \n "
      f"(iii) 2% estimated increase in delivery cost for the rest of the countries of AUD "
      f"{df_not_in_top6_freight_dif:,.0f} and \n "
      f"(iv) 0.42% (1 month's inflation assuming yearly inflation of 5%) of AUD "
      f"{df_final_budget_with_inflation_diff:,.0f}.")
