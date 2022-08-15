Feature: Case summary

  Background:
    Given Maria signs in

  Scenario: View case summary
    Given Maria searches for a case
    And Maria views the overview page
    And Maria views the personal details page
    And Maria views the licence conditions page
    And Maria views the Contact history page
    And Maria filters contacts by date range
    And Maria starts a new recommendation
    And Maria explains how the person has responded to probation so far
    And Maria continues from the Stop and Think page
    And Maria recommends a fixed term recall
    And Maria states that it's not an emergency recall
    And Maria selects a custody status
    And Maria states there are victims in the victim contact scheme
    Then Maria sees a confirmation page
    And Maria downloads the Part A
    And Maria updates the recommendation