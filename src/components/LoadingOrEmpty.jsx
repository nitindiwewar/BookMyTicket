/**
 * LoadingOrEmpty - Helper component for conditional rendering of loading, empty, and content states
 * @component
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {boolean} props.isEmpty - Whether data is empty
 * @param {React.ReactNode} props.loadingContent - Content to show when loading
 * @param {React.ReactNode} props.emptyContent - Content to show when empty
 * @param {React.ReactNode} props.children - Content to show when not loading and not empty
 * @returns {JSX.Element}
 * @example
 * <LoadingOrEmpty
 *   isLoading={isLoading}
 *   isEmpty={empty}
 *   loadingContent={<Skeleton />}
 *   emptyContent={<EmptyState />}
 * >
 *   <Content />
 * </LoadingOrEmpty>
 */
export default function LoadingOrEmpty({ isLoading, isEmpty, loadingContent, emptyContent, children }) {
  if (isLoading) return loadingContent;
  if (isEmpty) return emptyContent;
  return children;
}
