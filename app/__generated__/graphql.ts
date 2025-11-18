import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  GenericScalar: { input: any; output: any; }
};

export type ProductType = {
  __typename?: 'ProductType';
  brand?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** Get a structured summary of user reviews from the internet */
  reviewSummary?: Maybe<ReviewSummaryType>;
  /** Get a structured safety analysis for this product */
  safetyAnalysis?: Maybe<SafetyAnalysisType>;
  upcCode: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type ProductTypeReviewSummaryArgs = {
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
};


export type ProductTypeSafetyAnalysisArgs = {
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  allProducts?: Maybe<Maybe<ProductType>[]>;
  productById?: Maybe<ProductType>;
  productByUpc?: Maybe<ProductType>;
};


export type QueryProductByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProductByUpcArgs = {
  upc: Scalars['String']['input'];
};

/** Structured review summary data */
export type ReviewSummaryType = {
  __typename?: 'ReviewSummaryType';
  /** Whether this result was served from cache */
  cached?: Maybe<Scalars['Boolean']['output']>;
  /** Confidence level: high, medium, or low */
  confidence?: Maybe<Scalars['String']['output']>;
  /** Top negative points from reviews */
  cons?: Maybe<Maybe<Scalars['String']['output']>[]>;
  /** When this insight was generated */
  generatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Main themes mentioned */
  keyThemes?: Maybe<Maybe<Scalars['String']['output']>[]>;
  /** Top positive points from reviews */
  pros?: Maybe<Maybe<Scalars['String']['output']>[]>;
  /** LLM provider used */
  provider?: Maybe<Scalars['String']['output']>;
  /** Overall sentiment: positive, negative, or mixed */
  sentiment?: Maybe<Scalars['String']['output']>;
  /** Sentiment score from 0.0 (negative) to 1.0 (positive) */
  sentimentScore?: Maybe<Scalars['Float']['output']>;
  /** Brief overview of reviews */
  summary?: Maybe<Scalars['String']['output']>;
};

/** Structured safety analysis data */
export type SafetyAnalysisType = {
  __typename?: 'SafetyAnalysisType';
  /** Common allergens present */
  allergens?: Maybe<Maybe<Scalars['String']['output']>[]>;
  /** Whether this result was served from cache */
  cached?: Maybe<Scalars['Boolean']['output']>;
  /** Safety certifications or standards */
  certifications?: Maybe<Maybe<Scalars['String']['output']>[]>;
  /** Confidence level: high, medium, or low */
  confidence?: Maybe<Scalars['String']['output']>;
  /** When this insight was generated */
  generatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** List of potentially harmful ingredients */
  harmfulIngredients?: Maybe<Maybe<Scalars['GenericScalar']['output']>[]>;
  /** LLM provider used */
  provider?: Maybe<Scalars['String']['output']>;
  /** Recent recalls or safety issues */
  recalls?: Maybe<Maybe<Scalars['GenericScalar']['output']>[]>;
  /** Who should avoid this product */
  recommendations?: Maybe<Scalars['String']['output']>;
  /** Overall risk level: low, medium, or high */
  riskLevel?: Maybe<Scalars['String']['output']>;
  /** Brief safety overview */
  summary?: Maybe<Scalars['String']['output']>;
};

export type GetProductQueryVariables = Exact<{
  upc: Scalars['String']['input'];
}>;


export type GetProductQuery = { __typename?: 'Query', productByUpc?: { __typename?: 'ProductType', upcCode: string, brand?: string | null, name: string, id: string } | null };


export const GetProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upc"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productByUpc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upc"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upcCode"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetProductQuery, GetProductQueryVariables>;