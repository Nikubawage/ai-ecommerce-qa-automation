@product-quantity
Feature: Product quantity limits
  Customers can select a quantity from 1 through 99 on a product details page.

  @ep @bva
  Scenario: Accept the minimum valid quantity
    Given the customer is viewing a product with a quantity field
    When they set the quantity to 1
    Then the quantity input should show 1

  @ep @bva
  Scenario: Accept the maximum valid quantity
    Given the customer is viewing a product with a quantity field
    When they set the quantity to 99
    Then the quantity input should show 99

  @bva @error-guessing
  Scenario: Normalize a quantity below the lower limit
    Given the customer is viewing a product with a quantity field
    When they set the quantity to 0
    Then the quantity input should show 1

  @bva @error-guessing
  Scenario: Normalize a quantity above the upper limit and notify the customer
    Given the customer is viewing a product with a quantity field
    When they set the quantity to 100
    Then the quantity input should show 99
    And the quantity limit message should say "You can order at most 99 of this product."
