import pandas as pd  # import module

# load CSV files into a dataframe
df_order_details = pd.read_csv("order_details.csv")
df_orders = pd.read_csv("orders.csv")

# calculate revenue sales per order id.
df_order_details["revenue"] = df_order_details["unit_price"] * df_order_details['quantity']
df_revenue_id = df_order_details[["order_id", "revenue"]]

# group by id to get total revenue sales
df_sum_revenue_id = df_revenue_id.groupby(["order_id"]).sum().reset_index()

# combine df to get total revenue sales with customer name
df_concat = pd.concat([df_orders["customer_name"], df_sum_revenue_id], axis=1)

# combine dfs to get total revenue sales and number of orders with customer name
df_orders_customer = pd.pivot_table(df_concat, index=['customer_name'], aggfunc={'revenue': sum, 'order_id': len})
highest_orders = df_orders_customer.sort_values('order_id', ascending=False).nlargest(6, 'revenue')

# print outputs
print(f"{highest_orders}")
print(f"\n{highest_orders.index[0]}, {highest_orders.index[1]} and {highest_orders.index[5]}"
      f" had the highest number of orders, {highest_orders.iloc[0]['order_id']:.0f} in total each.")

print(f"\n{highest_orders.index[2]}, {highest_orders.index[3]} and {highest_orders.index[4]}"
      f" don't buy frequently, but they represent a significant revenue.")



